import { ScrollReveal } from './ScrollReveal';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  variant?: 'dark' | 'light';
}

export function SectionHeader({ eyebrow, title, description, align = 'center', variant = 'dark' }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${styles[align]} ${variant === 'light' ? styles.light : ''}`}>
      {eyebrow && (
        <ScrollReveal>
          <p className={styles.eyebrow}>{eyebrow}</p>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.1}>
        <h2 className={styles.title}>{title}</h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={0.2}>
          <p className={styles.description}>{description}</p>
        </ScrollReveal>
      )}
    </div>
  );
}
