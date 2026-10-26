import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  Send,
  Heart,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Please enter your message'),
});

export default function ContactFormSection({ fullPage = false }) {
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '', error: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '', error: '' });

    try {
      const response = await api.submitContact(values);
      setSubmittedName(values.name);
      setSubmitStatus({
        success: true,
        message: response.message || 'Thank you! Your message has been sent successfully.',
        error: '',
      });
      setShowSuccessModal(true);
      reset();
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: '',
        error: err.message || 'Unable to deliver message right now. Please reach out directly via WhatsApp or phone.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact section-pad" style={fullPage ? { paddingTop: '40px' } : undefined}>
      <div className="contact-details">
        <span className="eyebrow">
          <span className="eyebrow-line"></span>LET'S CONNECT
        </span>
        <h2>
          Contact <em>us.</em>
        </h2>
        <p className="contact-intro">
          Have a question, an idea, or want to support our work? We would love to hear from you. Reach out through our
          direct channels or send us a message below.
        </p>

        <a className="contact-direct" href="tel:03029616426">
          <span className="contact-direct-icon">
            <Phone size={19} />
          </span>
          <span>03029616426</span>
          <ArrowUpRight size={16} className="contact-direct-arrow" />
        </a>

        <a className="contact-direct" href="mailto:Saagarwelfarefoundation@gmail.com">
          <span className="contact-direct-icon">
            <Mail size={19} />
          </span>
          <span>Saagarwelfarefoundation@gmail.com</span>
          <ArrowUpRight size={16} className="contact-direct-arrow" />
        </a>

        <div className="contact-direct" style={{ textDecoration: 'none' }}>
          <span className="contact-direct-icon">
            <MapPin size={19} />
          </span>
          <span>Lahore, Pakistan</span>
        </div>

        <a
          className="whatsapp-button"
          href="https://wa.me/923029616426"
          target="_blank"
          rel="noreferrer"
          style={{ marginTop: '22px' }}
        >
          <MessageCircle size={20} /> Message on WhatsApp <ArrowUpRight size={16} />
        </a>

        <div className="contact-signoff">
          <span className="gold-dot"></span> Compassion starts with a conversation.
        </div>
      </div>

      <div className="contact-form-card">
        <div className="form-notice">
          <Heart size={17} />
          <span>We welcome your inquiries, collaborative initiatives, and questions.</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {submitStatus.error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px',
                background: '#fdf2f2',
                borderLeft: '4px solid #d9383a',
                color: '#981b1d',
                fontSize: '12px',
                marginBottom: '20px',
                borderRadius: '4px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{submitStatus.error}</span>
            </div>
          )}

          {submitStatus.success && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                background: '#071020',
                border: '1px solid #efc75e',
                color: '#fff',
                fontSize: '13px',
                marginBottom: '22px',
                borderRadius: '8px',
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#efc75e', flexShrink: 0 }} />
              <span>{submitStatus.message}</span>
            </div>
          )}

          <label htmlFor="contact-name">Full Name *</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            {...register('name')}
            style={errors.name ? { borderColor: '#d9383a' } : undefined}
          />
          {errors.name && (
            <p style={{ color: '#d9383a', fontSize: '11px', marginTop: '-16px', marginBottom: '16px' }}>
              {errors.name.message}
            </p>
          )}

          <label htmlFor="contact-email">Email Address *</label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            style={errors.email ? { borderColor: '#d9383a' } : undefined}
          />
          {errors.email && (
            <p style={{ color: '#d9383a', fontSize: '11px', marginTop: '-16px', marginBottom: '16px' }}>
              {errors.email.message}
            </p>
          )}

          <div className="contact-two-col">
            <div>
              <label htmlFor="contact-phone">Phone Number (Optional)</label>
              <input id="contact-phone" type="tel" placeholder="03001234567" {...register('phone')} />
            </div>
            <div>
              <label htmlFor="contact-subject">Subject (Optional)</label>
              <input id="contact-subject" type="text" placeholder="General question" {...register('subject')} />
            </div>
          </div>

          <label htmlFor="contact-message">Message *</label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="How can we assist or collaborate?"
            {...register('message')}
            style={errors.message ? { borderColor: '#d9383a' } : undefined}
          />
          {errors.message && (
            <p style={{ color: '#d9383a', fontSize: '11px', marginTop: '-16px', marginBottom: '16px' }}>
              {errors.message.message}
            </p>
          )}

          <button
            className="form-submit"
            type="submit"
            disabled={isSubmitting}
            style={{ minWidth: '180px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.8 : 1 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Sending...
              </>
            ) : (
              <>
                Send Message <Send size={16} />
              </>
            )}
          </button>

          <p className="form-disclaimer">
            Your inquiry is stored securely and viewed only by the Saagar Foundation team.
          </p>
        </form>
      </div>

      {/* POP-UP CONFIRMATION MODAL WHEN VISITOR SENDS MESSAGE */}
      <AnimatePresence>
        {showSuccessModal && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 120 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setShowSuccessModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                background: '#071020',
                border: '2px solid #efc75e',
                borderRadius: '16px',
                padding: '40px 32px',
                maxWidth: '480px',
                width: '92%',
                textAlign: 'center',
                color: '#fff',
                boxShadow: '0 25px 70px rgba(0,0,0,0.6)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                  background: 'none',
                  border: 0,
                  color: '#efc75e',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(239, 199, 94, 0.15)',
                  border: '2px solid #efc75e',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 20px',
                  color: '#efc75e',
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <span
                className="eyebrow light"
                style={{ fontSize: '10px', letterSpacing: '0.15em', marginBottom: '8px', display: 'block' }}
              >
                INQUIRY DELIVERED
              </span>

              <h3
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '28px',
                  margin: '0 0 14px',
                  color: '#ffffff',
                }}
              >
                Thank You, <em style={{ color: '#efc75e', fontStyle: 'normal' }}>{submittedName || 'Friend'}</em>
              </h3>

              <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#d1d5df', margin: '0 0 28px' }}>
                Your message has been received with care. It has been delivered directly to the Saagar Foundation
                team, and we will get in touch with you shortly.
              </p>

              <button
                type="button"
                className="button button-gold"
                onClick={() => setShowSuccessModal(false)}
                style={{ width: '100%', padding: '14px', fontSize: '13px', justifyContent: 'center' }}
              >
                Done / Continue Browsing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
