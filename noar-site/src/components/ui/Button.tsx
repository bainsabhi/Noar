import styles from './Button.module.css';

type ButtonVariant = 'outline' | 'outline-light' | 'filled' | 'amber';

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Button({ variant = 'outline', href, children, className = '', onClick }: ButtonProps) {
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
