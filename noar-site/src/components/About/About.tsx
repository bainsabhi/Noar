import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import aboutImage from '../../assets/about-land-development.jpg';
import styles from './About.module.css';

const CAPABILITIES = [
  'Pre-acquisition parcel screening and development potential reviews',
  'Municipal policy and zoning interpretation for early-stage decisions',
  'Constraint mapping, submission requirements, and approvals roadmaps',
  'Upfront cost, timeline, and risk input before land is committed',
];

export function About() {
  return (
    <section className={styles.split} id="about-section">
      <div className={styles.text}>
        <ScrollReveal>
          <p>
            Noar Development helps clients study a site before major dollars are committed. Our work is
            focused on the questions that matter early: what can be built, what may hold a project back,
            how long approvals may take, and where key costs begin to stack up.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ul className={styles.list}>
            {CAPABILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p>
            For land buyers, developers, and investment groups, that means clearer decision-making at the
            front end and better preparation before a file moves into formal applications.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <Button href="#services" variant="outline">
            Explore Our Services
          </Button>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.15} className={styles.visual}>
        <div className={styles.visualImg}>
          <img
            src={aboutImage}
            alt="High-rise residential towers in Toronto"
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.accent1} />
        <div className={styles.accent2} />
      </ScrollReveal>
    </section>
  );
}
