import { SectionHeader } from '../ui/SectionHeader';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import styles from './Culture.module.css';

export function Culture() {
  return (
    <section className={styles.culture} id="philosophy">
      <SectionHeader eyebrow="Our Philosophy" title="What Matters at Noar Development" />
      <ScrollReveal>
        <p className={styles.description}>
          We believe every land investment should start with clarity. Our work is grounded in
          rigorous research, transparent reporting, and a commitment to giving our clients the
          confidence they need before committing capital. We measure our success not by transactions
          closed, but by the quality of the decisions we help our clients make.
        </p>
      </ScrollReveal>
      <ScrollReveal>
        <div className={styles.buttons}>
          <Button href="#contact" variant="amber">Get in Touch</Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
