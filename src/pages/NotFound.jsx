import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: '#071020',
        color: 'white',
        padding: '60px 20px',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <span className="eyebrow light">404 — PAGE NOT FOUND</span>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: ' clamp(48px, 6vw, 76px)',
            margin: '18px 0',
          }}
        >
          Lost on your <em>journey?</em>
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#c5c9d4', marginBottom: '32px' }}>
          The page you are looking for might have moved, been renamed, or is temporarily unavailable. Let us guide you back to our work.
        </p>
        <Link to="/" className="button button-gold">
          Return to Homepage <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}
