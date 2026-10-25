import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  CreditCard,
  User,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalEvents: 0, publishedEvents: 0, totalSubmissions: 0, unreadSubmissions: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Events State
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Community',
    label: 'Community outreach',
    location: '',
    date: 'FOOD DRIVE',
    image: '',
    description: '',
    isPublished: true,
    order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [submissionFilter, setSubmissionFilter] = useState('');
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Donation State
  const [donationData, setDonationData] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    instructions: '',
    helpPhone: '',
    helpEmail: '',
  });
  const [savingDonation, setSavingDonation] = useState(false);
  const [donationNotice, setDonationNotice] = useState('');

  // Founder State
  const [founderData, setFounderData] = useState({
    name: '',
    title: '',
    portraitUrl: '',
    introduction: '',
    missionHighlight: '',
    visionHighlight: '',
  });
  const [savingFounder, setSavingFounder] = useState(false);
  const [founderNotice, setFounderNotice] = useState('');

  // Load Initial Overview & Data
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await api.getAllEventsAdmin();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadSubmissions = async (status = '') => {
    try {
      setLoadingSubmissions(true);
      const res = await api.getSubmissionsAdmin(status);
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const loadDonation = async () => {
    try {
      const res = await api.getDonationInfo();
      if (res.success && res.data) {
        setDonationData(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadFounder = async () => {
    try {
      const res = await api.getFounderInfo();
      if (res.success && res.data) {
        setFounderData(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
    loadEvents();
    loadSubmissions();
    loadDonation();
    loadFounder();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Image upload handler
  const handleFileUpload = async (e, targetField = 'event') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        if (targetField === 'event') {
          setEventForm((prev) => ({ ...prev, image: res.url }));
        } else if (targetField === 'founder') {
          setFounderData((prev) => ({ ...prev, portraitUrl: res.url }));
        }
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Event modal actions
  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      category: 'Community',
      label: 'Community outreach',
      location: 'Lahore, Pakistan',
      date: 'UPCOMING',
      image: '',
      description: '',
      isPublished: true,
      order: events.length + 1,
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      category: event.category,
      label: event.label,
      location: event.location,
      date: event.date,
      image: event.image,
      description: event.description,
      isPublished: event.isPublished,
      order: event.order || 0,
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent._id, eventForm);
      } else {
        await api.createEvent(eventForm);
      }
      setEventModalOpen(false);
      loadEvents();
      loadStats();
    } catch (err) {
      alert(`Error saving event: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await api.deleteEvent(id);
      loadEvents();
      loadStats();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Submissions Actions
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateSubmissionStatus(id, { status });
      loadSubmissions(submissionFilter);
      loadStats();
      if (selectedSubmission && selectedSubmission._id === id) {
        setSelectedSubmission((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;
    try {
      await api.deleteSubmission(id);
      setSelectedSubmission(null);
      loadSubmissions(submissionFilter);
      loadStats();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Donation Actions
  const handleSaveDonation = async (e) => {
    e.preventDefault();
    try {
      setSavingDonation(true);
      setDonationNotice('');
      const res = await api.updateDonationInfo(donationData);
      if (res.success) {
        setDonationNotice('Public donation information updated successfully!');
        setTimeout(() => setDonationNotice(''), 4000);
      }
    } catch (err) {
      alert(`Failed to update donation settings: ${err.message}`);
    } finally {
      setSavingDonation(false);
    }
  };

  // Founder Actions
  const handleSaveFounder = async (e) => {
    e.preventDefault();
    try {
      setSavingFounder(true);
      setFounderNotice('');
      const res = await api.updateFounderInfo(founderData);
      if (res.success) {
        setFounderNotice('Founder profile content updated successfully!');
        setTimeout(() => setFounderNotice(''), 4000);
      }
    } catch (err) {
      alert(`Failed to update founder content: ${err.message}`);
    } finally {
      setSavingFounder(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4ef', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar */}
      <header
        style={{
          background: '#071020',
          color: 'white',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: 0, color: '#efc75e' }}>
            Saagar Admin Portal
          </h1>
          <span style={{ fontSize: '11px', background: 'rgba(239,199,94,0.15)', color: '#efc75e', padding: '3px 8px', borderRadius: '4px' }}>
            Production Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '12px', color: '#c5c9d4' }}>
            Signed in as <strong>{user?.email}</strong>
          </span>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#efc75e',
              textDecoration: 'underline',
            }}
          >
            Live Site <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: '240px',
            background: '#0a1426',
            color: '#c5c9d4',
            padding: '24px 14px',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '6px',
              border: 0,
              background: activeTab === 'overview' ? '#efc75e' : 'transparent',
              color: activeTab === 'overview' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'overview' ? 700 : 500,
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <LayoutDashboard size={17} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('events')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '6px',
              border: 0,
              background: activeTab === 'events' ? '#efc75e' : 'transparent',
              color: activeTab === 'events' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'events' ? 700 : 500,
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <Calendar size={17} /> Events Management
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '6px',
              border: 0,
              background: activeTab === 'submissions' ? '#efc75e' : 'transparent',
              color: activeTab === 'submissions' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'submissions' ? 700 : 500,
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={17} /> Contact Messages
            </div>
            {stats.unreadSubmissions > 0 && (
              <span
                style={{
                  background: activeTab === 'submissions' ? '#071020' : '#efc75e',
                  color: activeTab === 'submissions' ? '#fff' : '#071020',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '10px',
                }}
              >
                {stats.unreadSubmissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('donation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '6px',
              border: 0,
              background: activeTab === 'donation' ? '#efc75e' : 'transparent',
              color: activeTab === 'donation' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'donation' ? 700 : 500,
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <CreditCard size={17} /> Donation Bank Info
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '6px',
              border: 0,
              background: activeTab === 'founder' ? '#efc75e' : 'transparent',
              color: activeTab === 'founder' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'founder' ? 700 : 500,
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <User size={17} /> Founder Content
          </button>
        </aside>

        {/* Content Pane */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                    Dashboard Overview
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                    Genuine database figures and real-time operational status.
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadStats();
                    loadEvents();
                    loadSubmissions();
                  }}
                  className="button button-dark"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>

              {/* Genuine Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                <div style={{ background: '#fff', padding: '22px 24px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #efc75e' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>TOTAL EVENTS</span>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, color: '#071020', margin: '6px 0' }}>
                    {loadingStats ? '...' : stats.totalEvents}
                  </div>
                  <span style={{ fontSize: '11px', color: '#27ae60' }}>
                    {stats.publishedEvents} published publicly
                  </span>
                </div>

                <div style={{ background: '#fff', padding: '22px 24px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #1f7a4a' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>CONTACT SUBMISSIONS</span>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, color: '#071020', margin: '6px 0' }}>
                    {loadingStats ? '...' : stats.totalSubmissions}
                  </div>
                  <span style={{ fontSize: '11px', color: stats.unreadSubmissions > 0 ? '#d9383a' : '#27ae60' }}>
                    {stats.unreadSubmissions} awaiting reply
                  </span>
                </div>

                <div style={{ background: '#fff', padding: '22px 24px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #3498db' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>DATABASE CONNECTION</span>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 600, color: '#071020', margin: '12px 0 8px' }}>
                    MongoDB Active
                  </div>
                  <span style={{ fontSize: '11px', color: '#27ae60' }}>
                    Port 27017 / saagar_foundation
                  </span>
                </div>

                <div style={{ background: '#fff', padding: '22px 24px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #9b59b6' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>DONATION ACCOUNT</span>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#071020', margin: '14px 0 8px' }}>
                    Mashreq Bank
                  </div>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    Acct: 089120169858
                  </span>
                </div>
              </div>

              {/* Quick Jump Action Section */}
              <div style={{ background: '#fff', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: '0 0 16px' }}>
                  Quick Administrative Actions
                </h3>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button onClick={openCreateEventModal} className="button button-gold">
                    <Plus size={15} /> Add New Event Story
                  </button>
                  <button onClick={() => setActiveTab('submissions')} className="button button-dark">
                    <Mail size={15} /> View Recent Inquiries
                  </button>
                  <button onClick={() => setActiveTab('donation')} className="button button-dark">
                    <CreditCard size={15} /> Update Bank Transfer Details
                  </button>
                  <button onClick={() => setActiveTab('founder')} className="button button-dark">
                    <User size={15} /> Manage Founder Memoona Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS MANAGEMENT */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                    Events & Stories Management
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                    Manage the 6 approved humanitarian initiatives or publish new community updates.
                  </p>
                </div>
                <button onClick={openCreateEventModal} className="button button-gold">
                  <Plus size={16} /> Add New Event
                </button>
              </div>

              {/* Events Table */}
              <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead style={{ background: '#071020', color: 'white' }}>
                    <tr>
                      <th style={{ padding: '14px 18px' }}>Cover</th>
                      <th style={{ padding: '14px 18px' }}>Title</th>
                      <th style={{ padding: '14px 18px' }}>Category</th>
                      <th style={{ padding: '14px 18px' }}>Location</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((evt) => (
                      <tr key={evt._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px 18px' }}>
                          <img
                            src={evt.image}
                            alt=""
                            style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td style={{ padding: '12px 18px', fontWeight: 600, color: '#071020' }}>{evt.title}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ background: '#eee', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            {evt.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', color: '#666', fontSize: '12px' }}>{evt.location}</td>
                        <td style={{ padding: '12px 18px' }}>
                          {evt.isPublished ? (
                            <span style={{ color: '#27ae60', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                              <CheckCircle size={14} /> Published
                            </span>
                          ) : (
                            <span style={{ color: '#888', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                              <XCircle size={14} /> Draft
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditEventModal(evt)}
                            style={{ background: 'none', border: 0, color: '#bd9636', cursor: 'pointer', marginRight: '14px' }}
                            title="Edit Event"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt._id)}
                            style={{ background: 'none', border: 0, color: '#d9383a', cursor: 'pointer' }}
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                    Contact Submissions
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                    Securely view and manage direct messages submitted by visitors.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSubmissionFilter('');
                      loadSubmissions('');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: submissionFilter === '' ? '#071020' : '#fff',
                      color: submissionFilter === '' ? '#fff' : '#071020',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    All Messages
                  </button>
                  <button
                    onClick={() => {
                      setSubmissionFilter('unread');
                      loadSubmissions('unread');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: submissionFilter === 'unread' ? '#071020' : '#fff',
                      color: submissionFilter === 'unread' ? '#fff' : '#071020',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Unread Only
                  </button>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div style={{ background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '10px' }}>
                  <Mail size={36} style={{ color: '#aaa', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#666' }}>No messages found in this category.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1.2fr' : '1fr', gap: '20px' }}>
                  <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {submissions.map((sub) => (
                      <div
                        key={sub._id}
                        onClick={() => setSelectedSubmission(sub)}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid #eee',
                          cursor: 'pointer',
                          background: selectedSubmission?._id === sub._id ? 'rgba(239,199,94,0.1)' : '#fff',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '14px', color: '#071020' }}>{sub.name}</strong>
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: sub.status === 'unread' ? '#ffebeb' : sub.status === 'replied' ? '#eef9f2' : '#f0f0f0',
                              color: sub.status === 'unread' ? '#d9383a' : sub.status === 'replied' ? '#27ae60' : '#666',
                              fontWeight: 600,
                            }}
                          >
                            {sub.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                          {sub.email} {sub.phone && `• ${sub.phone}`}
                        </div>
                        <p style={{ fontSize: '12px', color: '#444', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Selected Message Inspector */}
                  {selectedSubmission && (
                    <div style={{ background: '#fff', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                        <div>
                          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', margin: '0 0 4px' }}>
                            {selectedSubmission.name}
                          </h3>
                          <a href={`mailto:${selectedSubmission.email}`} style={{ fontSize: '13px', color: '#183d31', textDecoration: 'underline' }}>
                            {selectedSubmission.email}
                          </a>
                          {selectedSubmission.phone && (
                            <span style={{ fontSize: '13px', color: '#666', marginLeft: '12px' }}>
                              Phone: <a href={`tel:${selectedSubmission.phone}`}>{selectedSubmission.phone}</a>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedSubmission(null)}
                          style={{ background: 'none', border: 0, color: '#888', cursor: 'pointer' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ background: '#faf8f2', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '11px', color: '#9d812d', fontWeight: 600 }}>SUBJECT: {selectedSubmission.subject || 'General Inquiry'}</span>
                        <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#333', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                          {selectedSubmission.message}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '18px' }}>
                        <button
                          onClick={() => handleUpdateStatus(selectedSubmission._id, 'replied')}
                          className="button button-gold"
                          style={{ padding: '8px 14px', fontSize: '11px' }}
                        >
                          <Check size={14} /> Mark as Replied
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedSubmission._id, 'read')}
                          className="button button-dark"
                          style={{ padding: '8px 14px', fontSize: '11px' }}
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(selectedSubmission._id)}
                          style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: '1px solid #d9383a',
                            color: '#d9383a',
                            padding: '8px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DONATION DETAILS */}
          {activeTab === 'donation' && (
            <div style={{ maxWidth: '680px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                  Public Donation Bank Transfer Details
                </h2>
                <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                  Updates here reflect immediately on the public website and donation cards.
                </p>
              </div>

              {donationNotice && (
                <div style={{ padding: '12px 16px', background: '#eef9f2', borderLeft: '4px solid #27ae60', color: '#135c31', fontSize: '13px', marginBottom: '20px', borderRadius: '4px' }}>
                  {donationNotice}
                </div>
              )}

              <form onSubmit={handleSaveDonation} style={{ background: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Account Holder Name</label>
                  <input
                    type="text"
                    required
                    value={donationData.accountHolder}
                    onChange={(e) => setDonationData({ ...donationData, accountHolder: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Bank Name</label>
                    <input
                      type="text"
                      required
                      value={donationData.bankName}
                      onChange={(e) => setDonationData({ ...donationData, bankName: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Account Number</label>
                    <input
                      type="text"
                      required
                      value={donationData.accountNumber}
                      onChange={(e) => setDonationData({ ...donationData, accountNumber: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>IBAN (Optional)</label>
                  <input
                    type="text"
                    value={donationData.iban}
                    onChange={(e) => setDonationData({ ...donationData, iban: e.target.value })}
                    placeholder="PK..."
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Support Helpline Phone</label>
                    <input
                      type="text"
                      value={donationData.helpPhone}
                      onChange={(e) => setDonationData({ ...donationData, helpPhone: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Support Helpline Email</label>
                    <input
                      type="email"
                      value={donationData.helpEmail}
                      onChange={(e) => setDonationData({ ...donationData, helpEmail: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Instructions Note</label>
                  <textarea
                    rows={3}
                    value={donationData.instructions}
                    onChange={(e) => setDonationData({ ...donationData, instructions: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <button type="submit" disabled={savingDonation} className="button button-gold">
                  {savingDonation ? 'Saving...' : 'Save Donation Details'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: FOUNDER CONTENT */}
          {activeTab === 'founder' && (
            <div style={{ maxWidth: '720px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                  Founder Profile Content
                </h2>
                <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                  Manage the portrait and verified statements presented on the dedicated /founder page.
                </p>
              </div>

              {founderNotice && (
                <div style={{ padding: '12px 16px', background: '#eef9f2', borderLeft: '4px solid #27ae60', color: '#135c31', fontSize: '13px', marginBottom: '20px', borderRadius: '4px' }}>
                  {founderNotice}
                </div>
              )}

              <form onSubmit={handleSaveFounder} style={{ background: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Founder Name</label>
                    <input
                      type="text"
                      required
                      value={founderData.name}
                      onChange={(e) => setFounderData({ ...founderData, name: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Title</label>
                    <input
                      type="text"
                      required
                      value={founderData.title}
                      onChange={(e) => setFounderData({ ...founderData, title: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Portrait URL and Upload */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Founder Portrait Image (URL or Upload)
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Leave empty to use client-approved memoona-founder.jpg asset"
                      value={founderData.portraitUrl}
                      onChange={(e) => setFounderData({ ...founderData, portraitUrl: e.target.value })}
                      style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <label
                      style={{
                        padding: '12px 16px',
                        background: '#071020',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={14} /> Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'founder')}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Quote / Introductory Statement</label>
                  <textarea
                    rows={2}
                    value={founderData.introduction}
                    onChange={(e) => setFounderData({ ...founderData, introduction: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Our Mission Statement</label>
                  <textarea
                    rows={4}
                    value={founderData.missionHighlight}
                    onChange={(e) => setFounderData({ ...founderData, missionHighlight: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Our Vision Statement</label>
                  <textarea
                    rows={5}
                    value={founderData.visionHighlight}
                    onChange={(e) => setFounderData({ ...founderData, visionHighlight: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <button type="submit" disabled={savingFounder} className="button button-gold">
                  {savingFounder ? 'Saving...' : 'Save Founder Profile'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT EVENT */}
      <AnimatePresence>
        {eventModalOpen && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 100 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEventModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: '#fff',
                width: 'min(640px, 95%)',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', margin: 0, color: '#071020' }}>
                  {editingEvent ? 'Edit Event Story' : 'Create New Event Story'}
                </h3>
                <button
                  onClick={() => setEventModalOpen(false)}
                  style={{ background: 'none', border: 0, color: '#888', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Saagar Community Drive"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Category *</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    >
                      <option value="Community">Community</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Sports">Sports</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Event Badge / Label</label>
                    <input
                      type="text"
                      value={eventForm.label}
                      onChange={(e) => setEventForm({ ...eventForm, label: e.target.value })}
                      placeholder="e.g. Community outreach"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Location *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="e.g. DHA Phase 8, Lahore"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Badge Date / Status</label>
                    <input
                      type="text"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      placeholder="e.g. FOOD DRIVE / 2026"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Cover Image URL *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                      placeholder="https://... or upload local file"
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <label
                      style={{
                        padding: '10px 14px',
                        background: '#071020',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={13} /> {uploadingImage ? '...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'event')}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Full Story Description *</label>
                  <textarea
                    rows={5}
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Enter the complete approved narrative of the initiative..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={eventForm.isPublished}
                    onChange={(e) => setEventForm({ ...eventForm, isPublished: e.target.checked })}
                  />
                  <label htmlFor="isPublished" style={{ fontSize: '13px', fontWeight: 600 }}>
                    Publish publicly on website
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    style={{ padding: '10px 16px', background: '#eee', border: 0, borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button button-gold" style={{ padding: '10px 20px', fontSize: '12px' }}>
                    {editingEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
