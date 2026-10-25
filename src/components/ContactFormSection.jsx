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
} from 'lucide-react';
import { api } from '../services/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Your message should be at least 10 characters long'),
});

export default function ContactFormSection({ fullPage = false }) {
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '', error: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setSubmitStatus({
        success: true,
        message: response.message || 'Thank you! Your message has been sent successfully.',
        error: '',
      });
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

        {submitStatus.success ? (
          <div
            style={{
              padding: '36px 28px',
              background: '#071020',
              border: '1px solid #efc75e',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 12px 35px rgba(7,16,32,0.25)',
            }}
          >
            <CheckCircle2 size={46} style={{ color: '#efc75e', margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#efc75e', margin: '0 0 10px' }}>
              Message Delivered
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#e3e5ec', margin: '0 0 24px', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
              {submitStatus.message}
            </p>
            <button
              type="button"
              className="button button-gold"
              onClick={() => setSubmitStatus({ success: false, message: '', error: '' })}
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
              Your inquiry is stored securely and viewed only by authorized Saagar Foundation administrators.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
