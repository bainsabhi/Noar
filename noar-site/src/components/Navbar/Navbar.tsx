import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useActiveSection } from '../../hooks/useActiveSection';
import { NoarMark } from '../ui/NoarMark';
import { FacebookIcon, EmailIcon, InstagramIcon, LinkedInIcon } from '../ui/SocialIcons';
import styles from './Navbar.module.css';

const HOME_NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about-section', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#contact', label: 'Contact' },
];

const SECTION_IDS = ['hero', 'about-section', 'services', 'philosophy', 'contact'];

export function Navbar() {
  const scrolled = useScrollPosition(60);
  const activeSection = useActiveSection(useMemo(() => SECTION_IDS, []));
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        <NoarMark style={{ height: 36, width: 'auto' }} variant={scrolled && !menuOpen ? 'dark' : 'light'} />
        <span className={styles.logoText}>Noar Development</span>
      </Link>

      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {isHomePage ? (
          HOME_NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`#${activeSection}` === href ? styles.active : ''}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))
        ) : (
          HOME_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              to={`/${href}`}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))
        )}
        <Link
          to="/projects"
          className={location.pathname.startsWith('/projects') ? styles.active : ''}
          onClick={closeMenu}
        >
          Projects
        </Link>
        <Link
          to="/calculator"
          className={location.pathname === '/calculator' ? styles.active : ''}
          onClick={closeMenu}
        >
          Calculator
        </Link>
      </div>

      <div className={styles.social}>
        <a href="#" aria-label="Facebook" rel="noopener noreferrer"><FacebookIcon /></a>
        <a href="#" aria-label="Email" rel="noopener noreferrer"><EmailIcon /></a>
        <a href="#" aria-label="Instagram" rel="noopener noreferrer"><InstagramIcon /></a>
        <a href="#" aria-label="LinkedIn" rel="noopener noreferrer"><LinkedInIcon /></a>
      </div>

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
