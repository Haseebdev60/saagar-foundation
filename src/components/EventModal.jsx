import React, { useEffect } from 'react';
import { X, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventModal({ event, onClose }) {
  useEffect(() => {
    if (!event) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [event, onClose]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.article
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close story">
              <X size={20} />
            </button>
            <img className="modal-image" src={event.image} alt={event.title} />
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="eyebrow">{event.label || event.category}</span>
                {event.date && (
                  <span
                    style={{
                      fontSize: '9px',
                      background: 'rgba(185,149,46,0.15)',
                      color: '#a38127',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Calendar size={11} /> {event.date}
                  </span>
                )}
              </div>
              <h2 id="modal-title">{event.title}</h2>
              <div className="event-location">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div style={{ margin: '20px 0', fontSize: '13px', lineHeight: 1.85, color: '#555b66' }}>
                {event.description.split('\n\n').map((p, idx) => (
                  <p key={idx} style={{ marginBottom: '14px' }}>
                    {p}
                  </p>
                ))}
              </div>
              <button className="button button-dark" onClick={onClose} style={{ marginTop: '8px' }}>
                Back to stories <ArrowRight size={16} />
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
