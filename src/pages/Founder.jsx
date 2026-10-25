import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import defaultPortrait from '../assets/memoona-founder.jpg';
import { api } from '../services/api';

export default function Founder() {
  const [founderData, setFounderData] = useState({
    name: 'Memoona',
    title: 'Founder, Saagar Foundation',
    portraitUrl: '',
    introduction: "The foundation’s work is guided by a commitment to compassion, kindness, and service to humanity.",
    missionHighlight: "The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive difference in people's lives through compassion, kindness, and service to humanity.",
    visionHighlight: "The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that continues to grow, serve, and make a difference for generations to come. Our dream is to create a foundation that stands the test of time, reaching as many people in need as possible and providing help wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on forever, touching countless lives and inspiring others to do the same.",
  });

  useEffect(() => {
    let isMounted = true;
    api
      .getFounderInfo()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setFounderData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const portraitSrc = founderData.portraitUrl || defaultPortrait;

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
        <p style={{ maxWidth: '580px', fontSize: '14px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          Guided by empathy and an unwavering resolve to uplift communities in need, Memoona established Saagar
          Foundation to transform compassion into tangible, everyday humanitarian service.
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
          <h2 style={{ fontSize: 'clamp(44px, 5vw, 64px)' }}>
            Meet <em>{founderData.name}.</em>
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              margin: '22px 0 28px',
              padding: '18px 20px',
              background: 'rgba(239,199,94,0.1)',
              borderLeft: '3px solid #efc75e',
            }}
          >
            <Quote size={24} style={{ color: '#bd9636', flexShrink: 0, marginTop: '2px' }} />
            <p
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '16px',
                fontStyle: 'italic',
                lineHeight: 1.6,
                color: '#1a2636',
                margin: 0,
              }}
            >
              "{founderData.introduction}"
            </p>
          </div>

          <div className="founder-values">
            <article className="founder-value">
              <div className="founder-value-top">
                <span>01 / OUR MISSION</span>
                <Heart size={17} />
              </div>
              <h3>Help, without hesitation.</h3>
              <p>{founderData.missionHighlight}</p>
            </article>

            <article className="founder-value">
              <div className="founder-value-top">
                <span>02 / OUR VISION</span>
                <Sparkles size={17} />
              </div>
              <h3>A legacy that lasts.</h3>
              <p>{founderData.visionHighlight}</p>
            </article>
          </div>

          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/events" className="button button-gold">
              Explore Our Ongoing Work <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="button button-dark">
              Reach Out to Us <ArrowRight size={16} />
            </Link>
          </div>

          <p className="founder-note" style={{ marginTop: '28px' }}>
            <span className="gold-dot"></span> Mission and vision statements belong to Saagar Foundation.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
