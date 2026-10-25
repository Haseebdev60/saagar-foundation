import React, { useState, useEffect } from 'react';
import { Copy, Check, Heart, HandHeart, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function DonationCard({ fullPage = false }) {
  const [copied, setCopied] = useState('');
  const [data, setData] = useState({
    accountHolder: 'Nabila Ahmad',
    bankName: 'Mashreq Bank',
    accountNumber: '089120169858',
    iban: '',
    instructions: 'Please verify the details with the foundation before making a transfer.',
    helpPhone: '03029616426',
    helpEmail: 'Saagarwelfarefoundation@gmail.com',
  });

  useEffect(() => {
    let isMounted = true;
    api
      .getDonationInfo()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(() => {
        // Fallback to default approved state
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const fields = [
    { label: 'Account Holder', value: data.accountHolder },
    { label: 'Bank Name', value: data.bankName },
    { label: 'Account Number', value: data.accountNumber },
    ...(data.iban ? [{ label: 'IBAN', value: data.iban }] : []),
  ];

  async function copyText(val, key) {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(''), 2200);
    } catch {
      setCopied('error');
      setTimeout(() => setCopied(''), 2200);
    }
  }

  const allDetailsString = fields.map((f) => `${f.label}: ${f.value}`).join('\n');

  return (
    <div className="account-card" style={{ maxWidth: fullPage ? '620px' : '520px', width: '100%', margin: fullPage ? '0 auto' : undefined }}>
      <div className="account-top">
        <span className="eyebrow">OFFICIAL BANK TRANSFER DETAILS</span>
        <span className="secure-mark" title="Direct manual bank transfer">
          <ShieldCheck size={18} />
        </span>
      </div>

      <h3 style={{ fontSize: '26px' }}>Direct Bank Transfer</h3>
      <p className="account-sub">
        {data.instructions || 'Please verify the details with the foundation before making a transfer.'}
      </p>

      <div className="account-fields">
        {fields.map(({ label, value }) => (
          <div className="account-field" key={label}>
            <div>
              <span>{label.toUpperCase()}</span>
              <strong style={{ userSelect: 'all', letterSpacing: label.includes('Number') ? '0.08em' : 'normal' }}>
                {value}
              </strong>
            </div>
            <button
              onClick={() => copyText(value, label)}
              aria-label={`Copy ${label}`}
              title={`Copy ${label}`}
              style={{
                background: copied === label ? 'rgba(239, 199, 94, 0.2)' : undefined,
                color: copied === label ? '#bd9636' : undefined,
              }}
            >
              {copied === label ? <Check size={17} /> : <Copy size={16} />}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="button button-gold copy-all"
        onClick={() => copyText(allDetailsString, 'all')}
        style={{ width: '100%', marginTop: '16px' }}
      >
        {copied === 'all' ? (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Check size={17} /> All details copied to clipboard!
            </span>
          </>
        ) : (
          <>
            <span>Copy all transfer details</span>
            <Copy size={16} />
          </>
        )}
      </button>

      <div
        style={{
          marginTop: '20px',
          padding: '12px 14px',
          background: '#f8f4e9',
          borderRadius: '4px',
          fontSize: '11px',
          lineHeight: '1.6',
          color: '#5b6158',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <HelpCircle size={15} style={{ color: '#b9952e', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <span>Need confirmation or have questions? Contact us at </span>
          <a href={`tel:${data.helpPhone}`} style={{ color: '#183d31', fontWeight: 600 }}>
            {data.helpPhone}
          </a>{' '}
          or{' '}
          <a href={`mailto:${data.helpEmail}`} style={{ color: '#183d31', fontWeight: 600 }}>
            {data.helpEmail}
          </a>
          .
        </div>
      </div>

      <p className="account-disclaimer" style={{ marginTop: '14px' }}>
        No payment is processed on this website. Saagar Foundation does not simulate automated confirmations.
      </p>
    </div>
  );
}
