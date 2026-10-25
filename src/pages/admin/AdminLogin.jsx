import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/saagar-logo.jpg';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // If already logged in, redirect
  if (user) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '80vh',
        display: 'grid',
        placeItems: 'center',
        background: '#071020',
        padding: '60px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#fff',
          borderRadius: '16px',
          padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '80px', height: '40px', margin: '0 auto 12px', overflow: 'hidden' }}>
            <img src={logo} alt="Saagar Foundation" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="eyebrow" style={{ color: '#9d812d' }}>
            AUTHORIZED ACCESS ONLY
          </span>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              color: '#071020',
              margin: '8px 0 6px',
            }}
          >
            Staff Portal
          </h2>
          <p style={{ fontSize: '12px', color: '#686e70', margin: 0 }}>
            Sign in to manage events, inquiries, and organization settings.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: '#fdf2f2',
              borderLeft: '4px solid #d9383a',
              color: '#981b1d',
              fontSize: '12px',
              marginBottom: '20px',
              borderRadius: '4px',
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#24342c', marginBottom: '8px' }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saagarfoundation.org"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid #c9cec5',
                  fontSize: '13px',
                  background: '#faf8f2',
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#888' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#24342c', marginBottom: '8px' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid #c9cec5',
                  fontSize: '13px',
                  background: '#faf8f2',
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#888' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-gold"
            style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <Link to="/" style={{ fontSize: '12px', color: '#737875', textDecoration: 'underline' }}>
            ← Return to public website
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
