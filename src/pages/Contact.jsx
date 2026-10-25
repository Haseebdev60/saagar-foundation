import React from 'react';
import { motion } from 'framer-motion';
import ContactFormSection from '../components/ContactFormSection';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="contact-page"
    >
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '85px max(7.5%, calc((100vw - 1160px)/2)) 60px',
        }}
      >
        <span className="eyebrow light">
          <span className="eyebrow-line"></span> REACH OUT TO US
        </span>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(44px, 5.5vw, 68px)',
            fontWeight: 500,
            lineHeight: 1.1,
            margin: '18px 0',
          }}
        >
          We’d love to <em>hear from you.</em>
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '14px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          Whether you want to volunteer, collaborate on a community drive, offer suggestions, or seek support, our team
          is here to listen and assist.
        </p>
      </section>

      {/* Main Interactive Contact Section */}
      <ContactFormSection fullPage={true} />
    </motion.div>
  );
}
