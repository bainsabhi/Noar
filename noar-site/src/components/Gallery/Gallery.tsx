import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '../../lib/sanity';
import type { SanityImage } from '../../types/project';
import styles from './Gallery.module.css';

interface GalleryProps {
  images: SanityImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    // Touch swipe support for mobile lightbox
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) goPrev();
        else goNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  if (!images || images.length === 0) return null;

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <button
            key={image._key || index}
            className={styles.thumb}
            onClick={() => openLightbox(index)}
            aria-label={image.alt || `Gallery image ${index + 1}`}
          >
            <img
              src={urlFor(image).width(400).height(300).auto('format').quality(80).url()}
              alt={image.alt || `Gallery image ${index + 1}`}
              loading="lazy"
            />
            <div className={styles.thumbOverlay} />
          </button>
        ))}
      </div>

      {/* Portal the lightbox to document.body so it escapes any
          ancestor stacking contexts (e.g. framer-motion page transitions) */}
      {createPortal(
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close gallery">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className={`${styles.navBtn} ${styles.prevBtn}`}
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    aria-label="Previous image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.navBtn} ${styles.nextBtn}`}
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    aria-label="Next image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}

              {/* Row 1: Counter */}
              <div className={styles.counter}>
                {lightboxIndex + 1} / {images.length}
              </div>

              {/* Row 2: Image (fills remaining vertical space) */}
              <motion.div
                key={lightboxIndex}
                className={styles.lightboxContent}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.24 }}
                onClick={(e) => e.stopPropagation()}
              >
                {activeImage && (
                  <figure className={styles.lightboxFigure}>
                    <div className={styles.imageStage}>
                      <img
                        src={urlFor(activeImage).auto('format').quality(90).url()}
                        alt={activeImage.alt || `Gallery image ${lightboxIndex + 1}`}
                        className={styles.lightboxImage}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    {activeImage.caption && (
                      <figcaption className={styles.caption}>{activeImage.caption}</figcaption>
                    )}
                  </figure>
                )}
              </motion.div>

              {/* Row 3: Thumbnail strip */}
              <div className={styles.thumbnailStrip} onClick={(e) => e.stopPropagation()}>
                {images.map((image, index) => (
                  <button
                    key={image._key || index}
                    className={`${styles.stripThumb} ${index === lightboxIndex ? styles.stripActive : ''}`}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={urlFor(image).width(120).height(80).auto('format').quality(70).url()}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
