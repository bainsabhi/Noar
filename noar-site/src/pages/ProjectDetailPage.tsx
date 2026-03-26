import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { useProject } from '../hooks/useProjects';
import { urlFor } from '../lib/sanity';
import { Gallery } from '../components/Gallery/Gallery';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, loading, error } = useProject(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}>
            <img src="/noar-logo.png" alt="" />
          </div>
          <span className={styles.loadingText}>Loading</span>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Project Not Found</h1>
          <p>The project you're looking for doesn't exist or hasn't been published yet.</p>
          <Link to="/projects" className={styles.backLink}>&larr; Back to Projects</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        {project.coverImage && (
          <img
            className={styles.heroImage}
            src={urlFor(project.coverImage).width(1600).height(700).auto('format').quality(85).url()}
            alt={project.title}
          />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to="/projects" className={styles.breadcrumb}>&larr; All Projects</Link>
          <h1>{project.title}</h1>
          <div className={styles.meta}>
            {project.location && <span className={styles.location}>{project.location}</span>}
            {project.propertyType && <span className={styles.badge}>{project.propertyType}</span>}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {project.description && project.description.length > 0 && (
          <section className={styles.description}>
            <h2>About This Project</h2>
            <div className={styles.descriptionBody}>
              <PortableText value={project.description} />
            </div>
          </section>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <section className={styles.gallerySection}>
            <h2>Gallery</h2>
            <Gallery images={project.gallery} />
          </section>
        )}
      </div>
    </main>
  );
}
