import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DonationCard from '../components/DonationCard';

export default function Donate() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="donate-page"
    >
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '85px max(7.5%, calc((100vw - 1160px)/2)) 70px',
          textAlign: 'center',
        }}
      >
        <span className="eyebrow light">BE PART OF SOMETHING MEANINGFUL</span>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(46px, 5.5vw, 72px)',
            fontWeight: 500,
            lineHeight: 1.1,
            margin: '18px 0',
          }}
        >
          Donate for <em>a Cause.</em>
        </h1>
        <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px', lineHeight: 1.85, color: '#c5c9d4' }}>
          Your generous contributions enable Saagar Foundation to serve nutritious meals, support orphaned children with
          educational essentials, and assist vulnerable animals across our communities.
        </p>
      </section>

      {/* Main Content Area */}
      <section
        className="section-pad"
        style={{
          background: '#faf7ef',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left Side: Instructions & Verification */}
        <div>
          <span className="eyebrow">HOW YOUR CONTRIBUTION HELPS</span>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 3.8vw, 46px)',
              margin: '16px 0 24px',
              color: '#071020',
            }}
          >
            Direct, transparent <em>giving.</em>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#efc75e',
                  color: '#071020',
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  fontSize: '13px',
                }}
              >
                1
              </div>
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 6px', color: '#071020' }}>
                  Use Authorized Bank Information
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5b616b', margin: 0 }}>
                  Initiate an online bank transfer, Raast payment, or ATM deposit using the official Mashreq Bank details
                  provided on this verified page.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#efc75e',
                  color: '#071020',
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  fontSize: '13px',
                }}
              >
                2
              </div>
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 6px', color: '#071020' }}>
                  Keep or Share Receipt for Record
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5b616b', margin: 0 }}>
                  For acknowledgment or verification, you are welcome to send a screenshot or receipt via WhatsApp to{' '}
                  <a href="https://wa.me/923029616426" target="_blank" rel="noreferrer" style={{ color: '#071020', fontWeight: 600, textDecoration: 'underline' }}>
                    03029616426
                  </a>{' '}
                  or by emailing{' '}
                  <a href="mailto:Saagarwelfarefoundation@gmail.com" style={{ color: '#071020', fontWeight: 600, textDecoration: 'underline' }}>
                    Saagarwelfarefoundation@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#efc75e',
                  color: '#071020',
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  fontSize: '13px',
                }}
              >
                3
              </div>
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 6px', color: '#071020' }}>
                  Direct Humanitarian Deployment
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5b616b', margin: 0 }}>
                  100% of received support goes directly toward funding welfare operations, community meal drives,
                  orphanage visits, and rescue causes.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '36px',
              padding: '20px',
              background: '#fff',
              border: '1px solid rgba(239,199,94,0.4)',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#bd9636', marginBottom: '8px' }}>
              <ShieldCheck size={20} />
              <strong style={{ fontSize: '14px', color: '#071020' }}>Security & Authenticity Note</strong>
            </div>
            <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#666b76', margin: 0 }}>
              Saagar Foundation maintains manual bank transfers to avoid third-party transaction fees and ensure direct
              accountability. We do not automatically charge cards or fabricate instant confirmation popups.
            </p>
          </div>
        </div>

        {/* Right Side: Reusable Bank Details Card */}
        <div>
          <DonationCard fullPage={true} />
        </div>
      </section>
    </motion.div>
  );
}
