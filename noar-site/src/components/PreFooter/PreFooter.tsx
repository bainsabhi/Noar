import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import styles from './PreFooter.module.css';

export function PreFooter() {
  return (
    <section className={styles.preFooter} id="contact">
      <ScrollReveal>
        <h3>Our team is ready to support you with your next investment.</h3>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <div className={styles.buttons}>
          <Button href="#" variant="filled">Contact Us</Button>
          <Button href="#" variant="outline">Book a Consultation</Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
