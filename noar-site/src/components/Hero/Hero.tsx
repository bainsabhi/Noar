import { motion, useScroll, useTransform } from 'framer-motion';
import { PhraseRotator } from '../ui/PhraseRotator';
import { NoarMark } from '../ui/NoarMark';
import { ChevronDownIcon } from '../ui/SocialIcons';
import styles from './Hero.module.css';

const heroEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      delay,
      ease: heroEase,
    },
  }),
};

export function Hero() {
  const { scrollY } = useScroll();

  // Multi-layer parallax: texture moves slightly slower than content
  const textureY = useTransform(scrollY, [0, 600], [0, 40]);   // mid layer
  const contentY = useTransform(scrollY, [0, 400], [0, -30]);  // fastest layer (text)
  const glowY = useTransform(scrollY, [0, 600], [0, 50]);      // glow moves with scroll

  // Content fades and moves up on scroll
  const markScrollOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className={`${styles.hero} dark-section`} id="hero">
      {/* Video background */}
      <div className={styles.videoBg}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230f2920' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </div>
      <motion.div className={styles.texture} style={{ y: textureY }} />
      <div className={styles.noiseOverlay} />
      <motion.div className={styles.glow} style={{ y: glowY }} />

      <motion.div className={styles.content} style={{ y: contentY }}>
        {/* Outer: scroll-driven opacity (MotionValue, zero re-renders) */}
        <motion.div className={styles.heroMark} style={{ opacity: markScrollOpacity }}>
          {/* Inner: entry animation only — y + opacity + blur on mount */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <NoarMark className={styles.markImg} variant="light" />
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.typeBlock}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          <p className={styles.typeIntro}>NOAR DEVELOPMENT</p>
          <div className={styles.typeFrame}>
            <PhraseRotator
              phrases={[
                'LAND ACQUISITION CLARITY',
                'SITE ANALYSIS AND DUE DILIGENCE',
                'ZONING, APPROVALS, AND RISK REVIEW',
              ]}
              interval={3400}
              className={styles.typeDynamic}
            />
          </div>
          <p className={styles.typeSupport}>
            MINIMAL, RESEARCH-LED GUIDANCE FOR INVESTORS, DEVELOPERS, AND LAND BANKING GROUPS ACROSS ONTARIO.
          </p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#statement"
        className={styles.chevron}
        aria-label="Scroll down"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.1}
      >
        <ChevronDownIcon />
      </motion.a>
    </section>
  );
}
