import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PhraseRotatorProps {
  phrases: string[];
  interval?: number;
  className?: string;
}

const phraseEase = [0.22, 1, 0.36, 1] as const;

export function PhraseRotator({
  phrases,
  interval = 3200,
  className = '',
}: PhraseRotatorProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (phrases.length <= 1 || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, phrases, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: phraseEase }}
          style={{ display: 'inline-block' }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
