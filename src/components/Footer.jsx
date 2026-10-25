import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, Shield } from 'lucide-react';
import logo from '../assets/saagar-logo.jpg';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="Saagar Foundation Home">
            <img src={logo} alt="Saagar Foundation logo" />
          </Link>
          <p>
            Compassion, kindness, and
            <br />
            service to humanity.
          </p>
          <p style={{ fontSize: '11px', color: '#8d929e', marginTop: '14px', lineHeight: 1.6 }}>
            Lahore, Pakistan
          </p>
        </div>

        <div className="footer-nav">
          <span className="eyebrow light">EXPLORE</span>
          <Link to="/">Home Overview</Link>
          <Link to="/about">About & Vision</Link>
          <Link to="/events">Our Work in Action</Link>
          <Link to="/founder">The Founder</Link>
          <Link to="/donate">Donate for a Cause</Link>
          <Link to="/contact">Get in Touch</Link>
        </div>

        <div className="footer-contact">
          <span className="eyebrow light">SAY HELLO</span>
          <a href="mailto:Saagarwelfarefoundation@gmail.com">
            Saagarwelfarefoundation@gmail.com <ArrowUpRight size={14} />
          </a>
          <a href="tel:03029616426">03029616426</a>
          <a
            href="https://wa.me/923029616426"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#efc75e' }}
          >
            Direct WhatsApp Chat <ArrowUpRight size={14} />
          </a>
          {user ? (
            <Link to="/admin" style={{ color: '#efc75e', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} /> Admin Portal
            </Link>
          ) : (
            <Link to="/admin/login" style={{ color: '#858995', marginTop: '6px', fontSize: '9px' }}>
              Staff Access
            </Link>
          )}
          <a className="back-top" href="#top" onClick={scrollToTop}>
            Back to top <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="footer-mark">
          S<span>.</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Saagar Foundation. All rights reserved.</span>
        <span>
          MADE WITH <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> FOR HUMANITY
        </span>
      </div>
    </footer>
  );
}
