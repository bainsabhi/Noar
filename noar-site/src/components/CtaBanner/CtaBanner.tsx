import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import styles from './CtaBanner.module.css';

export function CtaBanner() {
  return (
    <div className={styles.banner}>
      <ScrollReveal>
        <h3>
          Looking to Evaluate a Land Opportunity? Let Noar Development Provide the Due Diligence You Need.
        </h3>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <Button href="#contact" variant="outline-light">
          Book a Consultation
        </Button>
      </ScrollReveal>
    </div>
  );
}
