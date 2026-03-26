import { SectionHeader } from '../ui/SectionHeader';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import styles from './Services.module.css';

/* Thin-stroke architectural SVG icons for each service */
function SiteAnalysisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="28" height="28" rx="2" />
      <line x1="4" y1="14" x2="32" y2="14" />
      <line x1="14" y1="14" x2="14" y2="32" />
      <circle cx="23" cy="23" r="5" strokeDasharray="2 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
    </svg>
  );
}

function BudgetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 30V10l12-6 12 6v20" />
      <line x1="6" y1="10" x2="30" y2="10" />
      <line x1="12" y1="10" x2="12" y2="30" />
      <line x1="18" y1="6" x2="18" y2="30" />
      <line x1="24" y1="10" x2="24" y2="30" />
      <line x1="6" y1="30" x2="30" y2="30" />
    </svg>
  );
}

function ProjectMgmtIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h28v22H4z" />
      <path d="M4 8l14 10L32 8" />
      <line x1="10" y1="16" x2="10" y2="24" />
      <line x1="18" y1="20" x2="18" y2="24" />
      <line x1="26" y1="14" x2="26" y2="24" />
    </svg>
  );
}

const SERVICE_ICONS = [SiteAnalysisIcon, BudgetIcon, ProjectMgmtIcon];

const SERVICES = [
  {
    title: 'Site Analysis',
    description:
      'Evaluating net developable acreage and identifying constraints including conservation areas, heritage designations, road widenings, setback requirements, and lot coverage limitations.',
  },
  {
    title: 'Soft Cost Budgeting',
    description:
      'Researching application fees, development charges, holding cost provisions, and compiling complete submission checklists so investors can budget accurately before breaking ground.',
  },
  {
    title: 'Project Management',
    description:
      'Coordinating comment responses, tracking resubmission timelines, managing lot-level securities, obtaining access approvals, and overseeing servicing permits through to completion.',
  },
];

export function Services() {
  return (
    <section className={styles.services} id="services">
      <SectionHeader
        eyebrow="What We Do"
        title="How We Support Your Land Development Decisions"
        description="The land development approvals process involves zoning reviews, municipal requirements, conservation constraints, and cost projections. Whether you're evaluating a single parcel or assembling a larger portfolio — our team handles the research so you can invest with confidence."
        variant="light"
      />

      <div className={styles.grid}>
        {SERVICES.map((service, i) => {
          const Icon = SERVICE_ICONS[i];
          return (
            <ScrollReveal key={service.title} delay={i * 0.12}>
              <div className={styles.card}>
                <Icon className={styles.cardIcon} />
                <h3>{service.title}</h3>
                <p className={styles.description}>{service.description}</p>
              </div>
            </ScrollReveal>
          );
        })}

        <ScrollReveal delay={0.3}>
          <div className={`${styles.card} ${styles.ctaCard}`}>
            <h3>Interested in Working with Noar?</h3>
            <Button href="#contact" variant="outline-light" className={styles.ctaBtn}>
              Contact Us
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
