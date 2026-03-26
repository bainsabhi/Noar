import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import styles from './AnimatedStats.module.css';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 150, suffix: '+', label: 'Projects Completed' },
  { value: 2, suffix: 'B+', label: 'Land Value Analyzed' },
  { value: 25, suffix: '+', label: 'Years Experience' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 50 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        setDisplayValue(Math.floor(latest));
      }
    });
  }, [springValue]);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}

export function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={styles.stats} ref={ref}>
      <div className={styles.container}>
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={styles.stat}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.value}>
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className={styles.label}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
