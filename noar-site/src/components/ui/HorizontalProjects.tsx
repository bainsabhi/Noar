import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFeaturedProjects } from '../../hooks/useProjects';
import { urlFor } from '../../lib/sanity';
import { ScrollReveal } from './ScrollReveal';
import styles from './HorizontalProjects.module.css';
import type { Project } from '../../types/project';

const FALLBACK_PROJECTS: Pick<Project, '_id' | 'title' | 'slug' | 'location' | 'propertyType'>[] = [
  { _id: '1', title: 'The Emerald Tower', slug: { current: 'the-emerald-tower' }, location: 'Yorkville, Toronto', propertyType: 'Highrise' },
  { _id: '2', title: 'Harbourfront Residences', slug: { current: 'harbourfront-residences' }, location: 'Downtown Toronto', propertyType: 'Midrise' },
  { _id: '3', title: 'King West Lofts', slug: { current: 'king-west-lofts' }, location: 'King West, Toronto', propertyType: 'Low Rise Multi' },
];

export function HorizontalProjects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: featured, loading } = useFeaturedProjects();

  const projects = featured.length > 0 ? featured : FALLBACK_PROJECTS;
  const hasCoverImages = featured.length > 0;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) return null;

  return (
    <section className={styles.projects}>
      <div className={styles.header}>
        <ScrollReveal>
          <h2 className={styles.title}>Featured Developments</h2>
        </ScrollReveal>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.scrollContainer} ref={scrollRef}>
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            className={styles.card}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link to={`/projects/${project.slug.current}`} className={styles.cardLink}>
              <div className={styles.image}>
                {hasCoverImages && 'coverImage' in project && project.coverImage ? (
                  <img
                    src={urlFor(project.coverImage).width(600).height(400).auto('format').quality(80).url()}
                    alt={project.title}
                    loading="lazy"
                    className={styles.coverImg}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
                <div className={styles.overlay}>
                  <span className={styles.viewLabel}>View Project</span>
                </div>
              </div>
              <div className={styles.info}>
                <h3>{project.title}</h3>
                <p className={styles.location}>{project.location}</p>
                <span className={styles.type}>{project.propertyType}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
