import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { urlFor } from '../lib/sanity';
import type { Project, PropertyType } from '../types/project';
import styles from './ProjectsPage.module.css';

const FILTER_OPTIONS: Array<{ label: string; value: PropertyType | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'Single', value: 'Single' },
  { label: 'Low Rise Multi', value: 'Low Rise Multi' },
  { label: 'Midrise', value: 'Midrise' },
  { label: 'Highrise', value: 'Highrise' },
];

const FALLBACK_PROJECTS = [
  { _id: '1', title: 'The Emerald Tower', slug: { current: 'the-emerald-tower' }, location: 'Yorkville, Toronto', propertyType: 'Highrise' as PropertyType },
  { _id: '2', title: 'Harbourfront Residences', slug: { current: 'harbourfront-residences' }, location: 'Downtown Toronto', propertyType: 'Midrise' as PropertyType },
  { _id: '3', title: 'King West Lofts', slug: { current: 'king-west-lofts' }, location: 'King West, Toronto', propertyType: 'Low Rise Multi' as PropertyType },
];

function ProjectCard({ project, hasCoverImage }: { project: Project | typeof FALLBACK_PROJECTS[number]; hasCoverImage: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/projects/${project.slug.current}`} className={styles.card}>
        <div className={styles.cardImage}>
          {hasCoverImage && 'coverImage' in project && project.coverImage ? (
            <img
              src={urlFor(project.coverImage).width(600).height(400).auto('format').quality(80).url()}
              alt={project.title}
              loading="lazy"
            />
          ) : (
            <div className={styles.cardPlaceholder} />
          )}
          <div className={styles.cardOverlay}>
            <span className={styles.viewLabel}>View Project</span>
          </div>
        </div>
        <div className={styles.cardInfo}>
          <h3>{project.title}</h3>
          <p className={styles.cardLocation}>{project.location}</p>
          <span className={styles.cardType}>{project.propertyType}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonBadge} />
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const { data: projects, loading, error } = useProjects();
  const [activeFilter, setActiveFilter] = useState<PropertyType | 'All'>('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayProjects = !loading && !error && projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const hasCoverImages = !loading && !error && projects.length > 0;

  const filtered = activeFilter === 'All'
    ? displayProjects
    : displayProjects.filter((p) => p.propertyType === activeFilter);

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1>Our Projects</h1>
        <p>Explore our portfolio of exceptional developments across Canada.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.filters}>
          {FILTER_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              className={`${styles.filterBtn} ${activeFilter === value ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  hasCoverImage={hasCoverImages}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <p className={styles.empty}>No projects found in this category.</p>
        )}
      </div>
    </main>
  );
}
