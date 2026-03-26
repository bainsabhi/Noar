import { motion } from 'framer-motion';
import styles from './TrustBar.module.css';

const LOGOS = [
  { name: 'RBC', text: 'RBC Capital Markets' },
  { name: 'Brookfield', text: 'Brookfield Properties' },
  { name: 'Tridel', text: 'Tridel Group' },
  { name: 'Mattamy', text: 'Mattamy Homes' },
  { name: ' Daniels', text: 'Daniels Corporation' },
];

export function TrustBar() {
  return (
    <section className={styles.trust}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className={styles.label}>Trusted by leading developers and investors</p>
        <div className={styles.logos}>
          {LOGOS.map((logo, index) => (
            <motion.div
              key={logo.name}
              className={styles.logo}
              initial={{ opacity: 0.3, filter: 'grayscale(100%)' }}
              whileInView={{ opacity: 1, filter: 'grayscale(0%)' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ opacity: 0.7 }}
            >
              <span className={styles.logoText}>{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
