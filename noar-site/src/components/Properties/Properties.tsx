import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useFeaturedProjects } from '../../hooks/useProjects';
import { urlFor } from '../../lib/sanity';
import type { Project } from '../../types/project';
import styles from './Properties.module.css';

interface FallbackProperty {
  name: string;
  location: string;
  slug: string;
  propertyType: string;
}

const FALLBACK_PROPERTIES: FallbackProperty[] = [
  { name: 'The Emerald Tower', location: 'Yorkville, Toronto', slug: 'the-emerald-tower', propertyType: 'Highrise' },
  { name: 'Harbourfront Residences', location: 'Downtown Toronto', slug: 'harbourfront-residences', propertyType: 'Midrise' },
  { name: 'King West Lofts', location: 'King West, Toronto', slug: 'king-west-lofts', propertyType: 'Low Rise Multi' },
];

function SanityPropertyCard({ project, index }: { project: Project; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <Link to={`/projects/${project.slug.current}`} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.img}>
            <img
              src={urlFor(project.coverImage).width(600).height(400).auto('format').quality(80).url()}
              alt={project.title}
              className={styles.coverImg}
              loading="lazy"
            />
            <div className={styles.imgOverlay} />
          </div>
          <div className={styles.accent} />
          <div className={styles.info}>
            <h4>{project.title}</h4>
            <p className={styles.location}>{project.location}</p>
            <p className={styles.propertyType}>{project.propertyType}</p>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function FallbackPropertyCard({ property, index }: { property: FallbackProperty; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <Link to={`/projects/${property.slug}`} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={`${styles.img} ${styles[`img${index + 1}`]}`}>
            <div className={styles.geoPattern} />
            <div className={`${styles.silhouette} ${styles[`silhouette${index + 1}`]}`} />
          </div>
          <div className={styles.accent} />
          <div className={styles.info}>
            <h4>{property.name}</h4>
            <p className={styles.location}>{property.location}</p>
            <p className={styles.propertyType}>{property.propertyType}</p>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

export function Properties() {
  const { data: projects, loading, error } = useFeaturedProjects();
  const hasSanityData = !loading && !error && projects.length > 0;

  return (
    <section className={styles.properties} id="portfolio">
      <ScrollReveal>
        <h2 className={styles.title}>Portfolio</h2>
      </ScrollReveal>
      <ScrollReveal>
        <div className={styles.titleAccent} />
      </ScrollReveal>

      <div className={styles.grid}>
        {hasSanityData
          ? projects.map((project, i) => (
              <SanityPropertyCard key={project._id} project={project} index={i} />
            ))
          : FALLBACK_PROPERTIES.map((property, i) => (
              <FallbackPropertyCard key={property.name} property={property} index={i} />
            ))}
      </div>

      <ScrollReveal>
        <div className={styles.viewAll}>
          <Link to="/projects" className={styles.viewAllLink}>
            View All Projects &rarr;
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
