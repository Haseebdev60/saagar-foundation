import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Share2,
  Calendar,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { defaultEvents } from '../data/defaultEvents';

export default function EventDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  // Find fallback from defaultEvents immediately so page never renders empty
  const fallback = defaultEvents.find(
    (e) =>
      e.slug === idOrSlug ||
      e._id === idOrSlug ||
      String(e.id) === idOrSlug ||
      e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idOrSlug
  ) || defaultEvents[0];

  const getInitialEvent = () => {
    try {
      const cached = localStorage.getItem('saagar_cached_events_v2');
      if (cached) {
        const list = JSON.parse(cached);
        const match = list.find(
          (e) =>
            e.slug === idOrSlug ||
            e._id === idOrSlug ||
            String(e.id) === idOrSlug ||
            e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idOrSlug
        );
        if (match) return match;
      }
    } catch {}
    return fallback;
  };

  const [event, setEvent] = useState(getInitialEvent);
  const [allEvents, setAllEvents] = useState(defaultEvents);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Fetch live event data and events list
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch this event
    api
      .getEventByIdOrSlug(idOrSlug)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setEvent(res.data);
          setActiveIdx(0);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch event from API, using fallback:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Fetch full events list for "other initiatives"
    api
      .getEvents()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setAllEvents(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [idOrSlug]);

  // Gallery array resolution
  const gallery = React.useMemo(() => {
    if (event?.gallery && Array.isArray(event.gallery) && event.gallery.length > 0) {
      return event.gallery;
    }
    const defaultMatch = defaultEvents.find(
      (e) =>
        e.slug === event?.slug ||
        e.title === event?.title ||
        e._id === idOrSlug ||
        String(e.id) === idOrSlug
    );
    if (defaultMatch?.gallery && defaultMatch.gallery.length > 0) {
      return defaultMatch.gallery;
    }
    return event?.image ? [event.image] : [];
  }, [event, idOrSlug]);

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gallery.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gallery.length, lightboxOpen]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  const activePhoto = gallery[activeIdx] || event?.image || '/events/food-drive/food-drive-1.jpg';

  // Filter other events for bottom suggestions
  const otherEvents = allEvents
    .filter((e) => (e.slug || e._id) !== (event?.slug || event?._id))
    .slice(0, 3);

  // Split narrative into paragraphs
  const paragraphs = (event?.description || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: '#071020', minHeight: '100vh', color: '#fff' }}
    >
      {/* 1. Header / Breadcrumb Hero */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          padding: 'clamp(35px, 6vw, 60px) max(6%, calc((100vw - 1160px)/2)) 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <Link
            to="/events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#efc75e',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
          >
            <ArrowLeft size={16} /> All Initiatives & Stories
          </Link>

          <button
            onClick={handleShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {copiedShare ? (
              <>
                <CheckCircle2 size={14} style={{ color: '#27ae60' }} /> Link Copied!
              </>
            ) : (
              <>
                <Share2 size={14} /> Share Story
              </>
            )}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span
            style={{
              background: '#efc75e',
              color: '#071020',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: '4px',
            }}
          >
            {event?.date || 'EVENT'}
          </span>
          <span
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#d1d5db',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {event?.category || 'Community'}
          </span>
          {event?.label && (
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>
              • {event.label}
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 500,
            lineHeight: 1.15,
            color: '#fff',
            margin: '0 0 16px',
          }}
        >
          {event?.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#efc75e', fontSize: '14px', fontWeight: 500 }}>
          <MapPin size={16} />
          <span>{event?.location}</span>
        </div>
      </section>

      {/* 2. Photo Gallery & Story Section */}
      <section
        style={{
          padding: '40px max(6%, calc((100vw - 1160px)/2)) 80px',
          maxWidth: '1160px',
          margin: '0 auto',
        }}
      >
        {/* Main Photo Viewer Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 52vw, 580px)',
            background: '#040810',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(239, 199, 94, 0.25)',
          }}
        >
          <img
            key={activePhoto}
            src={activePhoto}
            alt={`${event?.title} - photo ${activeIdx + 1}`}
            loading="eager"
            decoding="async"
            onError={(err) => {
              err.currentTarget.src = '/events/food-drive/food-drive-1.jpg';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'opacity 0.25s ease',
            }}
          />

          {/* Floating Photo Counter Badge */}
          {gallery.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(7, 16, 32, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#efc75e',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(239, 199, 94, 0.4)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                zIndex: 3,
              }}
            >
              Photo {activeIdx + 1} of {gallery.length}
            </div>
          )}

          {/* Fullscreen Zoom Pill */}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="View photo in full screen"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(7, 16, 32, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              zIndex: 3,
            }}
          >
            <Maximize2 size={14} /> Full View
          </button>

          {/* Previous / Next Chevrons */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '16px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(7, 16, 32, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                  transition: 'background 0.2s',
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next photo"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(7, 16, 32, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                  transition: 'background 0.2s',
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Selector Strip (when multiple pictures exist) */}
        {gallery.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '16px 4px 8px',
              scrollbarWidth: 'thin',
              alignItems: 'center',
            }}
          >
            {gallery.map((imgUrl, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    position: 'relative',
                    width: '92px',
                    height: '66px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: isActive ? '3px solid #efc75e' : '1px solid rgba(255,255,255,0.15)',
                    padding: 0,
                    background: '#040810',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.65,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 12px rgba(239, 199, 94, 0.5)' : 'none',
                  }}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(err) => {
                      err.currentTarget.src = '/events/food-drive/food-drive-1.jpg';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        background: '#efc75e',
                        color: '#071020',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '1px 4px',
                        borderRadius: '3px',
                      }}
                    >
                      {idx + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Story Narrative & Impact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            marginTop: '45px',
          }}
        >
          {/* Main Story Narrative */}
          <div style={{ background: '#0b172a', padding: 'clamp(24px, 4vw, 36px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#efc75e',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '14px',
              }}
            >
              INITIATIVE OVERVIEW & STORY
            </span>

            <div style={{ color: '#e2e8f0', fontSize: '15.5px', lineHeight: 1.85, fontWeight: 400 }}>
              {paragraphs.map((p, idx) => (
                <p key={idx} style={{ margin: idx === 0 ? '0 0 18px' : '18px 0' }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Impact Quote Callout */}
            <div
              style={{
                marginTop: '32px',
                padding: '20px 24px',
                background: 'rgba(239, 199, 94, 0.08)',
                borderLeft: '4px solid #efc75e',
                borderRadius: '0 8px 8px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '17px',
                  fontStyle: 'italic',
                  color: '#fff',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                "At Saagar Foundation, we believe that even the smallest act of kindness can create a lasting impact across our communities."
              </p>
            </div>
          </div>

          {/* Sidebar Info & Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Details Box */}
            <div
              style={{
                background: '#0b172a',
                padding: '28px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff', margin: '0 0 16px' }}>
                Key Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Location:</span>
                  <span style={{ color: '#fff', fontWeight: 600, textAlign: 'right' }}>{event?.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Category:</span>
                  <span style={{ color: '#efc75e', fontWeight: 600 }}>{event?.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Focus:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{event?.label || 'Humanitarian Work'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: '#9ca3af' }}>Photos in gallery:</span>
                  <span style={{ color: '#efc75e', fontWeight: 700 }}>{gallery.length} Verified Photos</span>
                </div>
              </div>
            </div>

            {/* Support CTA Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, #13233d 0%, #080f1e 100%)',
                padding: '30px',
                borderRadius: '14px',
                border: '1px solid rgba(239, 199, 94, 0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              }}
            >
              <span style={{ color: '#efc75e', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>
                SUPPORT THE CAUSE
              </span>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#fff', margin: '8px 0 12px' }}>
                Help us reach more people in need.
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#c5c9d4', margin: '0 0 20px' }}>
                Every donation directly funds food drives, student education packages, and community visits.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/donate"
                  className="button button-gold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <Heart size={15} /> Support Our Initiatives
                </Link>
                <Link
                  to="/contact"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Contact or Volunteer <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. More Initiatives & Stories */}
        {otherEvents.length > 0 && (
          <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
              <div>
                <span style={{ color: '#efc75e', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>
                  MORE FROM SAAGAR FOUNDATION
                </span>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#fff', margin: '6px 0 0' }}>
                  Other Initiatives & Stories
                </h2>
              </div>
              <Link
                to="/events"
                style={{ color: '#efc75e', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              >
                View All <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {otherEvents.map((oe) => (
                <Link
                  key={oe._id || oe.id}
                  to={`/events/${oe.slug || oe._id || oe.id}`}
                  style={{
                    display: 'block',
                    background: '#0b172a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(239, 199, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div style={{ width: '100%', height: '170px', overflow: 'hidden' }}>
                    <img
                      src={oe.image}
                      alt={oe.title}
                      loading="lazy"
                      decoding="async"
                      onError={(err) => {
                        err.currentTarget.src = '/events/food-drive/food-drive-1.jpg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '18px' }}>
                    <span style={{ color: '#efc75e', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {oe.category}
                    </span>
                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '17px', color: '#fff', margin: '6px 0 10px', lineHeight: 1.3 }}>
                      {oe.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '12px' }}>
                      <MapPin size={12} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{oe.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. Lightbox Modal for High-Resolution Fullscreen Viewing */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close full view"
              style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                background: 'rgba(255,255,255,0.15)',
                border: 0,
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            {/* Photo Counter */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                color: '#efc75e',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              {activeIdx + 1} / {gallery.length} — {event?.title}
            </div>

            {/* Lightbox Image */}
            <img
              src={activePhoto}
              alt={event?.title}
              loading="eager"
              decoding="async"
              onError={(err) => {
                err.currentTarget.src = '/events/food-drive/food-drive-1.jpg';
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              }}
            />

            {/* Navigation Chevrons inside Lightbox */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next photo"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
