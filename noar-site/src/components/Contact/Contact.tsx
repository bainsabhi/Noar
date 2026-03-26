import { useState, type FormEvent } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import styles from './Contact.module.css';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className={`${styles.contact} dark-section`} id="contact">
      <div className={styles.inner}>
        <div className={styles.left}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Get In Touch</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className={styles.heading}>
              Let's Talk About<br />Your Next Project
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className={styles.description}>
              Our team is ready to support you with your next investment.
              Use the form to contact us regarding your enquiry. Please be
              as detailed as possible.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:info@noardev.ca" className={styles.contactValue}>
                  info@noardev.ca
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Toronto</span>
                <span className={styles.contactValue}>416-555-0140</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>General Inquiries</span>
                <span className={styles.contactValue}>info@noardev.ca</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className={styles.right}>
          <ScrollReveal delay={0.15}>
            {submitted ? (
              <div className={styles.thankYou}>
                <div className={styles.checkmark}>&#10003;</div>
                <h3>Thank You!</h3>
                <p>We've received your message and will be in touch shortly.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Your name"
                    />
                    <label htmlFor="contact-name">Full Name *</label>
                  </div>
                  <div className={styles.field}>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="you@company.com"
                    />
                    <label htmlFor="contact-email">Email Address *</label>
                  </div>
                </div>
                <div className={styles.field}>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    placeholder="(416) 000-0000"
                  />
                  <label htmlFor="contact-phone">Phone Number</label>
                </div>
                <div className={styles.field}>
                  <select id="contact-subject" name="subject" required defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    <option value="consultation">Book a Consultation</option>
                    <option value="investment">Investment Advisory</option>
                    <option value="property">Property Inquiry</option>
                    <option value="rfp">Request for Proposal</option>
                    <option value="other">Other</option>
                  </select>
                  <label htmlFor="contact-subject">Subject *</label>
                </div>
                <div className={styles.field}>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project or inquiry..."
                  />
                  <label htmlFor="contact-message">How Can We Help? *</label>
                </div>
                <button type="submit" className={styles.submit}>
                  Send Message
                  <span className={styles.arrow}>&rarr;</span>
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
