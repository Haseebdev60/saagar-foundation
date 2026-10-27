import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { defaultEvents } from '../data/defaultEvents';

const categories = ['All Stories', 'Community', 'Fundraising', 'Sports', 'Outreach', 'Animal Welfare'];

const getCachedEvents = () => {
  try {
    const cached = localStorage.getItem('saagar_cached_events');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return defaultEvents;
};

export default function Events() {
  const [events, setEvents] = useState(getCachedEvents);
  const [filter, setFilter] = useState('All Stories');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getEvents()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
          try {
            localStorage.setItem('saagar_cached_events', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (filter === 'All Stories') return events;
    return events.filter((e) => e.category === filter);
  }, [events, filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="events-page"
    >
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '85px max(7.5%, calc((100vw - 1160px)/2)) 70px',
        }}
      >
        <span className="eyebrow light">
          <span className="eyebrow-line"></span> HUMANITARIAN INITIATIVES
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
          Our work, <em>in action.</em>
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '14px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          Every gathering, food drive, visit, and tournament represents a tangible commitment to uplifting lives and
          fostering community spirit across Lahore.
        </p>
      </section>

      {/* Main Events Grid */}
      <section className="events section-pad" style={{ background: '#071020' }}>
        <div className="filters" role="group" aria-label="Filter stories">
          {categories.map((c) => {
            const count = c === 'All Stories' ? events.length : events.filter((e) => e.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={filter === c ? 'filter active' : 'filter'}
              >
                {c}
                <span>{String(count).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        <div className="event-grid">
          {visibleEvents.map((e, i) => {
            const eventLink = `/events/${e.slug || e._id || e.id}`;
            return (
              <motion.article
                className="event-card"
                key={e._id || e.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={eventLink}
                  className="event-image"
                  aria-label={`Read ${e.title}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <img src={e.image} alt={e.title} loading="lazy" />
                  <span className="image-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                  <span className="image-label">{e.date || 'EVENT'}</span>
                </Link>

                <div className="event-info">
                  <div className="event-meta">
                    <span>{e.category}</span>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <Link to={eventLink} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <h3>{e.title}</h3>
                  </Link>
                  <div className="event-location">
                    <MapPin size={14} />
                    <span>{e.location}</span>
                  </div>
                  <Link to={eventLink} className="story-link">
                    Read the story <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="events-bottom" style={{ marginTop: '50px' }}>
          <span>SMALL ACTIONS. MEANINGFUL IMPACT.</span>
          <span>{visibleEvents.length} STORIES SHOWN</span>
        </div>
      </section>
    </motion.div>
  );
}
