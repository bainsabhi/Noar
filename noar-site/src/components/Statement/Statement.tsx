import { ScrollReveal } from '../ui/ScrollReveal';
import styles from './Statement.module.css';

export function Statement() {
  return (
    <section className={styles.statement} id="statement">
      <ScrollReveal>
        <h2 className={styles.heading}>
          Noar Development is an independent land development consulting firm providing zoning reviews, municipal policy research, and due diligence support for informed land acquisition decisions.
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <hr className={styles.divider} />
        <p className={styles.location}>Serving Ontario</p>
      </ScrollReveal>
    </section>
  );
}
