import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import styles from './ProFormaCta.module.css';

export function ProFormaCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal>
          <span className={styles.label}>Free Tool</span>
          <h2 className={styles.title}>
            Pro Forma Calculator
          </h2>
          <p className={styles.desc}>
            Run detailed development pro formas for Waterloo Region with live DC calculations,
            MLI Select eligibility scoring, and 10-year cash flow projections — all built on
            Dec 2025 bylaw rates.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#9670;</span>
              <span>Live DC &amp; Budget Modeling</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#9670;</span>
              <span>MLI Select Tier Scoring</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#9670;</span>
              <span>Export to PDF &amp; CSV</span>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Link to="/calculator" className={styles.cta}>
            Open Calculator
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
