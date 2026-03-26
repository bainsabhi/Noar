import { Link } from 'react-router-dom';
import { NoarMark } from '../ui/NoarMark';
import { FacebookIcon, LinkedInIcon, InstagramIcon, EmailIcon } from '../ui/SocialIcons';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.logo}>
            <NoarMark style={{ height: 36, width: 'auto' }} variant="light" />
            <span className={styles.logoText}>Noar</span>
          </div>
          <p className={styles.tagline}>
            Real estate consultation &amp; advisory serving Ontario land development projects.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook" rel="noopener noreferrer"><FacebookIcon /></a>
            <a href="#" aria-label="LinkedIn" rel="noopener noreferrer"><LinkedInIcon /></a>
            <a href="#" aria-label="Instagram" rel="noopener noreferrer"><InstagramIcon /></a>
            <a href="#" aria-label="Email" rel="noopener noreferrer"><EmailIcon /></a>
          </div>
        </div>

        <div>
          <h4>Office</h4>
          <p>
            200 Bay Street<br />
            Suite 3400<br />
            Toronto, ON M5J 2J2
          </p>
          <p className={styles.phone}>416-555-0140</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <div className={styles.links}>
            <a href="#">Request for Proposal</a>
            <Link to="/projects">Projects</Link>
            <Link to="/calculator">Pro Forma Calculator</Link>
            <a href="#">Careers</a>
            <Link to="/#contact" className={styles.highlight}>Contact Us</Link>
          </div>
          <a href="mailto:info@noardev.ca" className={styles.email}>
            info@noardev.ca
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; 2026 Noar Development. All Rights Reserved.</p>
        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
