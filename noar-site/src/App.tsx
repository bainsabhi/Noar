import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Statement } from './components/Statement/Statement';
import { About } from './components/About/About';
import { Services } from './components/Services/Services';
import { CtaBanner } from './components/CtaBanner/CtaBanner';
import { Culture } from './components/Culture/Culture';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProFormaPage } from './pages/ProFormaPage';
import { HorizontalProjects } from './components/ui/HorizontalProjects';
import { LeadModal } from './components/ui/LeadModal';
import { MissingMiddle } from './components/MissingMiddle/MissingMiddle';
import { ProFormaCta } from './components/ProFormaCta/ProFormaCta';

const pageEase = [0.25, 0.46, 0.45, 0.94] as const;

const pageTransition = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'none', transition: { duration: 0.6, ease: pageEase } },
  exit: { opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.25 } },
};

/** Scroll progress indicator — thin amber line at top of viewport */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, width: '100%' }}
    />
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(id);
      if (!section) {
        return;
      }

      const top = section.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return null;
}

/** Thin amber divider between light sections */
function SectionDivider() {
  return <hr className="section-divider" />;
}

function HomePage() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 60 && !sessionStorage.getItem('leadModalShown')) {
        sessionStorage.setItem('leadModalShown', 'true');
        setTimeout(() => setShowLeadModal(true), 800);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Hero />
      <Statement />
      <SectionDivider />
      <About />
      <Services />
      <MissingMiddle />
      <ProFormaCta />
      <HorizontalProjects />
      <CtaBanner />
      <Culture />
      <Contact />
      <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />
    </>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollProgress />
      <ScrollToHash />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...pageTransition}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/calculator" element={<ProFormaPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
