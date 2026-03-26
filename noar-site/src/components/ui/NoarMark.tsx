interface NoarMarkProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'dark' | 'light';
}

export function NoarMark({ className, style }: NoarMarkProps) {
  return (
    <img
      src="/noar-logo.png"
      alt="Noar"
      className={className}
      style={style}
    />
  );
}
