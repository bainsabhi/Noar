/**
 * Custom TypeAnimation — same API as react-type-animation, but React 19-compatible.
 * react-type-animation 3.x uses internal patterns that break with React 19's renderer.
 */
import { useEffect, useRef, useState } from 'react';

interface TypeAnimationProps {
  sequence: (string | number)[];
  /** HTML tag to render as. Defaults to 'span'. */
  wrapper?: keyof React.JSX.IntrinsicElements;
  /** Typing speed 1–99 (higher = faster). Defaults to 40. */
  speed?: number;
  /** Deletion speed 1–99 (higher = faster). Defaults to match speed. */
  deletionSpeed?: number;
  /** Times to repeat. Use Infinity to loop forever. */
  repeat?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TypeAnimation({
  sequence,
  wrapper = 'span',
  speed = 40,
  deletionSpeed,
  repeat = 0,
  className = '',
  style,
}: TypeAnimationProps) {
  const [text, setText] = useState('');
  const textRef = useRef('');
  const cancelRef = useRef(false);

  // Convert speed (1–99) to ms-per-character, same formula as the original library.
  const typeMs = Math.abs(speed - 100);
  const deleteMs = Math.abs((deletionSpeed ?? speed) - 100);

  useEffect(() => {
    cancelRef.current = false;
    textRef.current = '';

    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const runOnce = async () => {
      for (const item of sequence) {
        if (cancelRef.current) return;

        // Numeric items are pauses in milliseconds.
        if (typeof item === 'number') {
          await sleep(item);
          continue;
        }

        const target = item;
        const cur = textRef.current;

        // Find the longest common prefix so we only delete what differs.
        let common = 0;
        while (
          common < cur.length &&
          common < target.length &&
          cur[common] === target[common]
        ) {
          common++;
        }

        // Delete back to the common prefix.
        while (textRef.current.length > common) {
          if (cancelRef.current) return;
          textRef.current = textRef.current.slice(0, -1);
          setText(textRef.current);
          await sleep(deleteMs);
        }

        // Type forward to the target.
        while (textRef.current.length < target.length) {
          if (cancelRef.current) return;
          textRef.current = target.slice(0, textRef.current.length + 1);
          setText(textRef.current);
          await sleep(typeMs);
        }
      }
    };

    const run = async () => {
      if (repeat === Infinity) {
        while (!cancelRef.current) await runOnce();
      } else {
        for (let i = 0; i <= repeat && !cancelRef.current; i++) {
          await runOnce();
        }
      }
    };

    run();

    return () => {
      cancelRef.current = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const Tag = wrapper;
  return (
    <Tag className={className} style={style}>
      {text}
    </Tag>
  );
}
