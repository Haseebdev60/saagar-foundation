import React, { useState, useEffect } from 'react';
import { X, MapPin, ArrowRight, Calendar, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventModal({ event, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const isFoodDrive =
    event?.title?.toLowerCase().includes('food drive') || event?.slug === 'saagar-foundation-food-drive';
  const foodDriveImages = [
    '/events/food-drive/food-drive-1.jpg',
    '/events/food-drive/food-drive-2.jpg',
    '/events/food-drive/food-drive-3.jpg',
    '/events/food-drive/food-drive-4.jpg',
    '/events/food-drive/food-drive-5.jpg',
  ];

  const images =
    event?.gallery && event.gallery.length > 0
      ? event.gallery
      : isFoodDrive
      ? foodDriveImages
      : event?.image
      ? [event.image]
      : [];

  useEffect(() => {
    setActiveIdx(0);
  }, [event]);

  useEffect(() => {
    if (!event) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [event, onClose, images.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[activeIdx] || event?.image;

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
            style={{ maxWidth: '880px' }}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close story">
              <X size={20} />
            </button>

            {/* Left Image & Gallery Column */}
            <div style={{ display: 'flex', flexDirection: 'column', background: '#050c18' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                  key={currentImage}
                  className="modal-image"
                  src={currentImage}
                  alt={`${event.title} photograph ${activeIdx + 1}`}
                  style={{ width: '100%', height: '100%', minHeight: '380px', objectFit: 'cover' }}
                />

                {/* Left/Right Arrows if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous photograph"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(7, 16, 32, 0.75)',
                        border: '1px solid rgba(239, 199, 94, 0.4)',
                        color: '#efc75e',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 3,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#efc75e', e.currentTarget.style.color = '#071020')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(7, 16, 32, 0.75)', e.currentTarget.style.color = '#efc75e')}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next photograph"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(7, 16, 32, 0.75)',
                        border: '1px solid rgba(239, 199, 94, 0.4)',
                        color: '#efc75e',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 3,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#efc75e', e.currentTarget.style.color = '#071020')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(7, 16, 32, 0.75)', e.currentTarget.style.color = '#efc75e')}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Counter Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(7, 16, 32, 0.85)',
                        border: '1px solid rgba(239, 199, 94, 0.3)',
                        borderRadius: '16px',
                        padding: '4px 10px',
                        color: '#fff',
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        zIndex: 3,
                      }}
                    >
                      <Camera size={12} style={{ color: '#efc75e' }} />
                      <span>{activeIdx + 1} / {images.length}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '12px 14px',
                    background: '#071020',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                  }}
                >
                  {images.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      style={{
                        width: '54px',
                        height: '42px',
                        padding: 0,
                        border: activeIdx === i ? '2px solid #efc75e' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        opacity: activeIdx === i ? 1 : 0.65,
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        background: '#000',
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Story Details Column */}
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
                {images.length > 1 && (
                  <span
                    style={{
                      fontSize: '9px',
                      background: 'rgba(7, 16, 32, 0.08)',
                      color: '#071020',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Camera size={11} /> {images.length} Photos
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
