import { NoarMark } from './NoarMark';
import styles from './NoarLogo.module.css';

interface NoarLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'lg';
}

export function NoarLogo({ variant = 'dark', className = '', size = 'lg' }: NoarLogoProps) {
  return (
    <div className={`${styles.logo} ${styles[variant]} ${styles[size]} ${className}`}>
      <NoarMark className={styles.mark} variant={variant === 'light' ? 'light' : 'dark'} />
      <span className={styles.wordmark}>NOAR</span>
    </div>
  );
}
