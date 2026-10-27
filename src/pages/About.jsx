import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="about-page"
    >
      {/* Editorial Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '90px max(7.5%, calc((100vw - 1160px)/2)) 80px',
          position: 'relative',
        }}
      >
        <span className="eyebrow light">
          <span className="eyebrow-line"></span> ABOUT SAAGAR FOUNDATION
        </span>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(44px, 5.5vw, 72px)',
            fontWeight: 500,
            lineHeight: 1.1,
            margin: '20px 0',
          }}
        >
          A commitment to <em>humanity.</em>
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '15px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          Saagar Foundation is a humanitarian welfare organization established in Lahore, Pakistan, dedicated to
          extending care, hope, and direct assistance to individuals and communities in need.
        </p>
      </section>

      {/* Main Mission & Vision Deep Dive */}
      <section className="mission" style={{ background: '#faf7ef' }}>
        <div className="mission-photo">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85"
            alt="Humanitarian community effort"
          />
          <div className="photo-caption">
            <span>PEOPLE FIRST</span>
            <span>KINDNESS ALWAYS</span>
          </div>
        </div>

        <div className="mission-content" style={{ padding: '80px clamp(30px, 5vw, 75px)' }}>
          <span className="eyebrow">FOUNDATIONAL PURPOSE</span>
          <h2 style={{ fontSize: 'clamp(38px, 4.5vw, 56px)', margin: '16px 0 28px' }}>
            Rooted in <em>empathy.</em>
          </h2>

          <div className="mission-block">
            <span className="block-number">01</span>
            <div>
              <h3>Our Mission</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.9, color: '#525761' }}>
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
              <p style={{ fontSize: '13px', lineHeight: 1.9, color: '#525761' }}>
                The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that
                continues to grow, serve, and make a difference for generations to come. Our dream is to create a
                foundation that stands the test of time, reaching as many people in need as possible and providing help
                wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on
                forever, touching countless lives and inspiring others to do the same.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '36px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/founder" className="button button-gold">
              Meet Founder Memoona Ahmad <ArrowRight size={16} />
            </Link>
            <Link to="/events" className="button button-dark">
              See Stories in Action <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="section-pad" style={{ background: '#f1ede3', borderTop: '1px solid rgba(9,18,35,0.08)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center', marginBottom: '50px' }}>
          <span className="eyebrow">WHAT WE BELIEVE</span>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(36px, 4vw, 52px)',
              margin: '16px 0',
            }}
          >
            Principles that guide <em>every effort.</em>
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#5e636f' }}>
            We measure our progress through genuine acts of service, direct engagement, and heartfelt respect for every
            individual we encounter.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '24px', maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ background: '#fff', padding: '34px 28px', border: '1px solid rgba(239,199,94,0.3)', borderRadius: '2px' }}>
            <Heart size={24} style={{ color: '#bd9636', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 10px', color: '#071020' }}>
              Unconditional Compassion
            </h3>
            <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#656a74', margin: 0 }}>
              Helping anyone in need regardless of their background, status, or circumstances. Kindness is universal and
              unconditional.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '34px 28px', border: '1px solid rgba(239,199,94,0.3)', borderRadius: '2px' }}>
            <Sparkles size={24} style={{ color: '#bd9636', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 10px', color: '#071020' }}>
              Generations to Come
            </h3>
            <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#656a74', margin: 0 }}>
              Building a lasting institution whose values, impact, and humanitarian presence stand the test of time for
              future generations.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '34px 28px', border: '1px solid rgba(239,199,94,0.3)', borderRadius: '2px' }}>
            <ShieldCheck size={24} style={{ color: '#bd9636', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 10px', color: '#071020' }}>
              Sincerity & Transparency
            </h3>
            <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#656a74', margin: 0 }}>
              Upholding pure intent in every initiative, from community food distribution to supporting orphanages and
              animal shelters.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
