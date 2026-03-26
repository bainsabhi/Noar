import { ScrollReveal } from '../ui/ScrollReveal';
import missingMiddle from '../../assets/missing-middle-housing.jpg';
import styles from './MissingMiddle.module.css';

export function MissingMiddle() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal>
          <p className={styles.eyebrow}>The Development Spectrum</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className={styles.title}>Understanding Missing Middle Housing</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className={styles.description}>
            From detached single-family homes to mid-rise residential, the missing middle represents
            the underbuilt range of housing types that Ontario municipalities are now actively
            rezoning to accommodate. Our due diligence work spans the full spectrum.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.15} className={styles.imageWrap}>
        <div className={styles.imageFrame}>
          <img
            src={missingMiddle}
            alt="Missing Middle Housing spectrum — from single-family homes to mid-rise buildings"
            className={styles.image}
            loading="lazy"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
