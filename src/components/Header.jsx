import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/saagar-logo.jpg';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const close = () => setOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About & Vision' },
    { to: '/events', label: 'Our Work' },
    { to: '/founder', label: 'Founder' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement">
        <span>PEOPLE FIRST. KINDNESS ALWAYS.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {user && (
            <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#efc75e' }}>
              <Shield size={11} /> Admin Panel
            </Link>
          )}
          <a href="mailto:Saagarwelfarefoundation@gmail.com" target="_blank" rel="noreferrer">
            Saagarwelfarefoundation@gmail.com <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="header">
        <div className="nav-wrap">
          <Link to="/" className="brand" aria-label="Saagar Foundation Home" onClick={close}>
            <img src={logo} alt="Saagar Foundation logo" />
          </Link>

          <button
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Nav */}
          <nav className="nav desktop-nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active-nav-link' : ''}`}
                  style={{ position: 'relative', padding: '8px 0' }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="nav-active-pill"
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#efc75e',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
            <Link className="nav-cta" to="/donate">
              Donate Now <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="nav mobile-nav-drawer"
              style={{
                position: 'absolute',
                top: '78px',
                left: 0,
                right: 0,
                background: '#071020',
                padding: '24px 6%',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                zIndex: 40,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={close}
                  style={{
                    color: location.pathname === link.to ? '#efc75e' : '#e3e5ec',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/admin"
                  onClick={close}
                  style={{
                    color: '#efc75e',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Shield size={14} /> Admin Dashboard
                </Link>
              )}
              <Link className="nav-cta" to="/donate" onClick={close} style={{ marginTop: '8px' }}>
                Donate Now <ArrowUpRight size={15} />
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
