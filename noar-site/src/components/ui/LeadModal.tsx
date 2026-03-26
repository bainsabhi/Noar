import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LeadModal.module.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {submitted ? (
              <motion.div
                className={styles.success}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.checkmark}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Thank You</h3>
                <p>We&apos;ll be in touch shortly.</p>
              </motion.div>
            ) : (
              <>
                <div className={styles.header}>
                  <span className={styles.eyebrow}>Get In Touch</span>
                  <h2 className={styles.title}>Request a Consultation</h2>
                  <p className={styles.description}>
                    Tell us about your project and we&apos;ll provide a preliminary assessment within 24 hours.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.field}>
                    <input
                      type="text"
                      id="lead-name"
                      placeholder="Your Name"
                      required
                    />
                    <label htmlFor="lead-name">Your Name *</label>
                  </div>
                  <div className={styles.field}>
                    <input
                      type="email"
                      id="lead-email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="lead-email">Email Address *</label>
                  </div>
                  <div className={styles.field}>
                    <textarea
                      id="lead-message"
                      placeholder="Tell us about your project..."
                      rows={3}
                    />
                    <label htmlFor="lead-message">Project Details</label>
                  </div>
                  <button type="submit" className={styles.submit}>
                    Submit Request
                    <span>&rarr;</span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
