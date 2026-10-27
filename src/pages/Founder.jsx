import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import defaultPortrait from '../assets/memoona-founder.jpg';
import { api } from '../services/api';

const DEFAULT_BIO = `At just 17 years old, Memoona Ahmad had a simple yet life-changing realization: people around her needed help, and someone had to step forward. Instead of waiting for someone else to make a difference, she founded Saagar Foundation, turning compassion into action. Memoona believes that everyone is equal and dreams of building a society where differences no longer divide people. Outgoing, energetic, and straightforward, she enjoys connecting with people and believes in being honest while remaining professional and committed to every responsibility she takes on.

Her love for Pakistan is at the heart of everything she does. Deeply patriotic, Memoona dreams of seeing Pakistan become the nation envisioned by Quaid-e-Azam Muhammad Ali Jinnah—a country built on unity, justice, discipline, and equal opportunities for all. His words continue to inspire her every step of the way. She firmly believes in his famous quote, "No power on earth can undo Pakistan," seeing it as a reminder of the nation's resilience and limitless potential. Another principle she lives by is, "With faith, discipline and selfless devotion to duty, there is nothing worthwhile that you cannot achieve." This philosophy became the driving force behind the creation of Saagar Foundation.

As Saagar Foundation continues to grow, so does Memoona's vision. She hopes to inspire more young people to believe that age is never a barrier to making a difference and wants others to understand that meaningful change begins with one decision—the decision to care, to act, and to serve. For Memoona Ahmad, Saagar Foundation is only the beginning. Her journey is fueled by faith, guided by discipline, and driven by a dream of a stronger, more compassionate, and more united Pakistan.`;

export default function Founder() {
  const [founderData, setFounderData] = useState({
    name: 'Memoona Ahmad',
    title: 'Founder, Saagar Foundation',
    portraitUrl: '',
    bio: DEFAULT_BIO,
  });

  useEffect(() => {
    let isMounted = true;
    api
      .getFounderInfo()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setFounderData((prev) => ({
            ...prev,
            ...res.data,
            name: res.data.name || 'Memoona Ahmad',
            bio: res.data.bio || DEFAULT_BIO,
          }));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const portraitSrc = founderData.portraitUrl || defaultPortrait;

  const bioParagraphs = (founderData.bio || DEFAULT_BIO)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="founder-page"
    >
      {/* Editorial Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '85px max(7.5%, calc((100vw - 1160px)/2)) 70px',
        }}
      >
        <span className="eyebrow light">
          <span className="eyebrow-line"></span> LEADERSHIP & VISION
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
          The person behind <em>the purpose.</em>
        </h1>
        <p style={{ maxWidth: '620px', fontSize: '15px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          At just 17 years old, Memoona Ahmad founded Saagar Foundation to turn compassion into action—bringing help
          without hesitation and building a more united, compassionate Pakistan.
        </p>
      </section>

      {/* Founder Profile Layout */}
      <section className="founder-section" style={{ minHeight: '740px' }}>
        <div className="founder-visual">
          <div className="founder-frame">
            <img
              className="founder-portrait-image"
              src={portraitSrc}
              alt={`${founderData.name}, ${founderData.title}`}
              style={{ objectFit: 'cover', borderRadius: '1px' }}
              loading="eager"
              decoding="async"
            />
            <span className="founder-frame-label">
              SAAGAR FOUNDATION <span>✳</span>
            </span>
          </div>
        </div>

        <div className="founder-content" style={{ padding: '75px clamp(28px, 5.5vw, 85px)' }}>
          <span className="eyebrow">
            <span className="eyebrow-line"></span> {founderData.title.toUpperCase()}
          </span>
          <p className="founder-overline">FOUNDER & VISIONARY</p>
          <h2 style={{ fontSize: 'clamp(40px, 5vw, 60px)', margin: '8px 0 28px' }}>
            Meet <em>{founderData.name}.</em>
          </h2>

          {/* Narrative Content */}
          <div
            className="founder-story"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              color: '#334155',
              fontSize: '15.5px',
              lineHeight: '1.85',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            {bioParagraphs.map((para, idx) => (
              <p
                key={idx}
                style={{
                  margin: 0,
                  color: idx === 0 ? '#1e293b' : '#334155',
                  fontSize: idx === 0 ? '16.5px' : '15.5px',
                  fontWeight: idx === 0 ? 500 : 400,
                  lineHeight: '1.85',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/events" className="button button-gold">
              Explore Our Ongoing Work <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="button button-dark">
              Reach Out to Us <ArrowRight size={16} />
            </Link>
          </div>

          <p className="founder-note" style={{ marginTop: '32px' }}>
            <span className="gold-dot"></span> Fueled by faith, guided by discipline, driven by service.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
