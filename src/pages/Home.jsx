import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Heart,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import memoonaPortrait from '../assets/memoona-founder.jpg';
import DonationCard from '../components/DonationCard';
import ContactFormSection from '../components/ContactFormSection';
import { api } from '../services/api';
import { defaultEvents } from '../data/defaultEvents';

const categories = ['All Stories', 'Community', 'Fundraising', 'Sports', 'Outreach', 'Animal Welfare'];

const getCachedEvents = () => {
  try {
    const cached = localStorage.getItem('saagar_cached_events_v2');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return defaultEvents;
};

export default function Home() {
  const [events, setEvents] = useState(getCachedEvents);
  const [filter, setFilter] = useState('All Stories');

  useEffect(() => {
    let isMounted = true;
    api
      .getEvents()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
          try {
            localStorage.setItem('saagar_cached_events_v2', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback to default approved list
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
    >
      {/* 1. Hero Section */}
      <section id="home" className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-inner">
          <motion.div
            className="eyebrow light"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="eyebrow-line"></span> PEOPLE FIRST. KINDNESS ALWAYS.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Small acts.
            <br />
            <em>Lasting change.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We believe compassion has no limits. Together, we turn simple acts of kindness into meaningful moments of
            care, support, and hope.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link className="button button-gold" to="/donate">
              Donate Now <ArrowRight size={17} />
            </Link>
            <Link className="text-link light-link" to="/events">
              Explore Our Work <ArrowDownRight size={17} />
            </Link>
          </motion.div>

          <div className="hero-note">
            <Heart size={15} /> Compassion, kindness, and service to humanity
          </div>
        </div>

        <div className="hero-index">
          <span>01</span>
          <span className="index-line"></span>
          <span>SAAGAR FOUNDATION</span>
        </div>
      </section>

      {/* 2. Purpose Intro Section */}
      <section id="purpose" className="intro section-pad">
        <div className="intro-kicker">
          <span className="eyebrow">A LITTLE GOOD GOES A LONG WAY</span>
          <span className="decor-star">✳</span>
        </div>
        <div className="intro-grid">
          <h2>
            Goodness grows
            <br />
            when we <em>share it.</em>
          </h2>
          <div className="intro-copy">
            <p>
              Saagar Foundation exists to help anyone in need, regardless of their circumstances. Through compassion,
              kindness, and service to humanity, we work to make a positive difference—one meaningful action at a time.
            </p>
            <Link className="text-link dark-link" to="/about">
              Get to know our vision <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="intro-rule">
          <span>01 / OUR PURPOSE</span>
          <span>ROOTED IN COMPASSION</span>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section id="mission" className="mission">
        <div className="mission-photo">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85"
            alt="Volunteers working together in community"
            loading="lazy"
          />
          <div className="photo-caption">
            <span>BETTER, TOGETHER</span>
            <span>SAAGAR FOUNDATION</span>
          </div>
        </div>

        <div className="mission-content">
          <span className="eyebrow">WHAT GUIDES US</span>
          <h2>
            A future built
            <br />
            on <em>kindness.</em>
          </h2>

          <div className="mission-block">
            <span className="block-number">01</span>
            <div>
              <h3>Our Mission</h3>
              <p>
                The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by
                providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive
                difference in people’s lives through compassion, kindness, and service to humanity.
              </p>
            </div>
          </div>

          <div className="mission-block">
            <span className="block-number">02</span>
            <div>
              <h3>Our Vision</h3>
              <p>
                The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that
                continues to grow, serve, and make a difference for generations to come. Our dream is to create a
                foundation that stands the test of time, reaching as many people in need as possible and providing help
                wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on
                forever, touching countless lives and inspiring others to do the same.
              </p>
            </div>
          </div>

          <div className="mission-signoff">
            <span className="gold-dot"></span> A legacy of compassion, for generations to come.
          </div>
        </div>
      </section>

      {/* 4. Events / Stories Section */}
      <section id="work" className="events section-pad">
        <div className="events-heading">
          <div>
            <span className="eyebrow light">OUR WORK IN THE WORLD</span>
            <h2>
              Kindness, <em>in action.</em>
            </h2>
          </div>
          <p>Every gathering, visit, and shared effort is a reminder that a little help can travel a long way.</p>
        </div>

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
                className={`event-card ${i === 0 && filter === 'All Stories' ? 'event-featured' : ''}`}
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
                  <img
                    src={e.image}
                    alt={e.title}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(err) => {
                      err.currentTarget.src = '/events/food-drive/food-drive-1.jpg';
                    }}
                  />
                  <span className="image-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                  <span className="image-label">{e.date || 'STORY'}</span>
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

        <div className="events-bottom">
          <span>SMALL ACTIONS. MEANINGFUL IMPACT.</span>
          <Link to="/events" style={{ color: '#efc75e', textDecoration: 'underline' }}>
            View all stories & archives <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>
      </section>

      {/* 5. Founder Spotlight */}
      <section id="founder" className="founder-section">
        <div className="founder-visual">
          <div className="founder-frame">
            <img className="founder-portrait-image" src={memoonaPortrait} alt="Memoona, founder of Saagar Foundation" />
            <span className="founder-frame-label">
              SAAGAR FOUNDATION <span>✳</span>
            </span>
          </div>
        </div>

        <div className="founder-content">
          <span className="eyebrow">
            <span className="eyebrow-line"></span> THE PERSON BEHIND THE PURPOSE
          </span>
          <p className="founder-overline">FOUNDER, SAAGAR FOUNDATION</p>
          <h2>
            Meet <em>Memoona.</em>
          </h2>
          <p className="founder-intro">
            The foundation’s work is guided by a commitment to compassion, kindness, and service to humanity.
          </p>

          <div className="founder-values">
            <article className="founder-value">
              <div className="founder-value-top">
                <span>01 / OUR MISSION</span>
                <Heart size={17} />
              </div>
              <h3>Help, without hesitation.</h3>
              <p>
                The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by
                providing support, resources, and assistance in whatever ways possible.
              </p>
            </article>

            <article className="founder-value">
              <div className="founder-value-top">
                <span>02 / OUR VISION</span>
                <Sparkles size={17} />
              </div>
              <h3>A legacy that lasts.</h3>
              <p>
                The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that
                continues to grow, serve, and make a difference for generations to come.
              </p>
            </article>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link className="button button-gold" to="/founder">
              Read Founder’s Profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Donation Callout Section */}
      <section id="contribute" className="donation">
        <div className="donation-orb"></div>
        <div className="donation-left">
          <span className="eyebrow light">BE PART OF SOMETHING MEANINGFUL</span>
          <h2>
            Donate for
            <br />
            <em>a Cause.</em>
          </h2>
          <p>
            If you would like to support Saagar Foundation, the account details provided by the foundation are listed
            here for direct reference.
          </p>
          <div className="donation-foot">
            <span>Your support can help kindness travel further.</span>
          </div>
          <div style={{ marginTop: '28px' }}>
            <Link to="/donate" className="text-link light-link">
              View full donation guide <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <DonationCard />
      </section>

      {/* 7. Contact Section */}
      <ContactFormSection />
    </motion.div>
  );
}
