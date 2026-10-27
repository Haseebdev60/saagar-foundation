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
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Key,
  Upload,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  X,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { processMultipleImageFiles, optimizeGalleryForSave } from '../../utils/imageCompressor';

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
    gallery: [],
    description: '',
    isPublished: true,
    order: 0,
  });
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventSaveError, setEventSaveError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Submissions State
  const [submissions, setSubmissions] = useState([]);
  const [submissionFilter, setSubmissionFilter] = useState('');
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteTargetSubmission, setDeleteTargetSubmission] = useState(null);
  const [actionToast, setActionToast] = useState('');

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

  // Password / Security State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

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
      // Fetch events with fallback to public endpoint if admin token is refreshing
      let res = await api.getAllEventsAdmin().catch(() => null);
      if (!res || !res.success || !res.data) {
        res = await api.getEvents().catch(() => null);
      }
      if (res && res.success && res.data && res.data.length > 0) {
        setEvents(res.data);
        try {
          localStorage.setItem('saagar_cached_events', JSON.stringify(res.data));
        } catch {}
      }
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadSubmissions = async (status = '') => {
    try {
      setLoadingSubmissions(true);
      setSubmissionError('');
      const res = await api.getSubmissionsAdmin(status);
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (e) {
      console.error(e);
      setSubmissionError(e.message || 'Failed to load submissions.');
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

  // Gallery image actions
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploadingGallery(true);
      const newImages = await processMultipleImageFiles(files);
      if (newImages.length > 0) {
        setEventForm((prev) => {
          const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
          const updatedGallery = [...currentGallery, ...newImages];
          const updatedCover = prev.image || updatedGallery[0] || '';
          return {
            ...prev,
            gallery: updatedGallery,
            image: updatedCover,
          };
        });
      }
    } catch (err) {
      alert(`Error uploading images: ${err.message}`);
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    setEventForm((prev) => {
      const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
      const updatedGallery = [...currentGallery, trimmed];
      const updatedCover = prev.image || trimmed;
      return {
        ...prev,
        gallery: updatedGallery,
        image: updatedCover,
      };
    });
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (idxToRemove) => {
    setEventForm((prev) => {
      const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
      const imageToRemove = currentGallery[idxToRemove];
      const updatedGallery = currentGallery.filter((_, idx) => idx !== idxToRemove);
      let updatedCover = prev.image;
      if (updatedCover === imageToRemove) {
        updatedCover = updatedGallery[0] || '';
      }
      return {
        ...prev,
        gallery: updatedGallery,
        image: updatedCover,
      };
    });
  };

  const handleSetCoverPhoto = (imgUrl) => {
    setEventForm((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  // Event modal actions
  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventSaveError('');
    setSavingEvent(false);
    setEventForm({
      title: '',
      category: 'Community',
      label: 'Community outreach',
      location: 'Lahore, Pakistan',
      date: 'UPCOMING',
      image: '',
      gallery: [],
      description: '',
      isPublished: true,
      order: events.length + 1,
    });
    setGalleryUrlInput('');
    setEventModalOpen(true);
  };

  const openEditEventModal = async (event) => {
    setEditingEvent(event);
    setEventSaveError('');
    setSavingEvent(false);
    setGalleryUrlInput('');

    // Pre-populate with table row data
    const initialGallery = event.image ? [event.image] : [];
    setEventForm({
      title: event.title || '',
      category: event.category || 'Community',
      label: event.label || '',
      location: event.location || '',
      date: event.date || 'UPCOMING',
      image: event.image || '',
      gallery: initialGallery,
      description: event.description || '',
      isPublished: event.isPublished !== undefined ? event.isPublished : true,
      order: event.order || 0,
    });
    setEventModalOpen(true);

    // Fetch full event detail with complete gallery
    try {
      const fullRes = await api.getEventByIdOrSlug(event.slug || event._id);
      if (fullRes && fullRes.success && fullRes.data) {
        const fullData = fullRes.data;
        const resolvedGallery = Array.isArray(fullData.gallery) && fullData.gallery.length > 0
          ? fullData.gallery
          : (fullData.image ? [fullData.image] : []);
        setEventForm({
          title: fullData.title,
          category: fullData.category,
          label: fullData.label,
          location: fullData.location,
          date: fullData.date,
          image: fullData.image || (resolvedGallery[0] || ''),
          gallery: resolvedGallery,
          description: fullData.description,
          isPublished: fullData.isPublished,
          order: fullData.order || 0,
        });
      }
    } catch (e) {
      console.warn('Could not fetch full event detail:', e);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setEventSaveError('');
    try {
      setSavingEvent(true);

      const finalImage = eventForm.image || (eventForm.gallery && eventForm.gallery[0]) || '';
      if (!finalImage) {
        setEventSaveError('Please add at least one picture for this event.');
        setSavingEvent(false);
        return;
      }

      // Optimize all gallery photos before saving to stay under cloud limit
      const rawGallery = (eventForm.gallery && eventForm.gallery.length > 0)
        ? eventForm.gallery
        : [finalImage];

      const finalGallery = await optimizeGalleryForSave(rawGallery);
      const finalCover = finalImage.startsWith('data:image/')
        ? (await optimizeGalleryForSave([finalImage]))[0]
        : finalImage;

      const payload = {
        ...eventForm,
        image: finalCover,
        gallery: finalGallery,
      };

      // Guard check: ensure request size doesn't exceed 4.1MB
      const payloadStr = JSON.stringify(payload);
      const totalBytes = new Blob([payloadStr]).size;
      const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

      if (totalBytes > 4.1 * 1024 * 1024) {
        setEventSaveError(`Total photo size (${totalMB} MB) exceeds serverless limit (4.1 MB). Please remove 1 or 2 photos.`);
        setSavingEvent(false);
        return;
      }

      if (editingEvent) {
        await api.updateEvent(editingEvent._id, payload);
      } else {
        await api.createEvent(payload);
      }

      setEventModalOpen(false);
      setActionToast('Event saved successfully!');
      setTimeout(() => setActionToast(''), 4000);
      loadEvents();
      loadStats();
    } catch (err) {
      console.error('Error saving event:', err);
      let msg = err.message || 'Unknown error occurred while saving.';
      if (msg.includes('413') || msg.includes('Too Large')) {
        msg = 'Total photo size is too large for cloud hosting. Please delete 1 or 2 photos.';
      } else if (msg.includes('401') || msg.includes('Not authorized') || msg.includes('token')) {
        msg = 'Your session has expired. Please log in again to save changes.';
      }
      setEventSaveError(msg);
    } finally {
      setSavingEvent(false);
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

  const triggerDeleteSubmission = (sub) => {
    setDeleteTargetSubmission(sub);
  };

  const confirmDeleteSubmission = async () => {
    if (!deleteTargetSubmission) return;
    try {
      await api.deleteSubmission(deleteTargetSubmission._id);
      const name = deleteTargetSubmission.name;
      setDeleteTargetSubmission(null);
      setSelectedSubmission(null);
      loadSubmissions(submissionFilter);
      loadStats();
      setActionToast(`Inquiry from ${name} has been permanently deleted.`);
      setTimeout(() => setActionToast(''), 4500);
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

  // Password Update Action
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordNotice('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.success) {
        setPasswordNotice(res.message || 'Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setActionToast('Administrator password updated successfully.');
        setTimeout(() => {
          setActionToast('');
          setPasswordNotice('');
        }, 5000);
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4ef', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar */}
      <header className="admin-header">
        <div className="admin-header-title">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', margin: 0, color: '#efc75e' }}>
            Saagar Admin Portal
          </h1>
          <span style={{ fontSize: '11px', background: 'rgba(239,199,94,0.15)', color: '#efc75e', padding: '3px 8px', borderRadius: '4px' }}>
            Production Dashboard
          </span>
        </div>

        <div className="admin-header-actions">
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
      <div className="admin-layout">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <button
            onClick={() => setActiveTab('overview')}
            className="admin-nav-item"
            style={{
              background: activeTab === 'overview' ? '#efc75e' : 'transparent',
              color: activeTab === 'overview' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'overview' ? 700 : 500,
            }}
          >
            <LayoutDashboard size={17} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className="admin-nav-item"
            style={{
              background: activeTab === 'events' ? '#efc75e' : 'transparent',
              color: activeTab === 'events' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'events' ? 700 : 500,
            }}
          >
            <Calendar size={17} /> Events Management
          </button>

          <button
            onClick={() => {
              setActiveTab('submissions');
              loadSubmissions(submissionFilter);
              loadStats();
            }}
            className="admin-nav-item"
            style={{
              justifyContent: 'space-between',
              background: activeTab === 'submissions' ? '#efc75e' : 'transparent',
              color: activeTab === 'submissions' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'submissions' ? 700 : 500,
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
            className="admin-nav-item"
            style={{
              background: activeTab === 'donation' ? '#efc75e' : 'transparent',
              color: activeTab === 'donation' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'donation' ? 700 : 500,
            }}
          >
            <CreditCard size={17} /> Donation Bank Info
          </button>

          <button
            onClick={() => setActiveTab('founder')}
            className="admin-nav-item"
            style={{
              background: activeTab === 'founder' ? '#efc75e' : 'transparent',
              color: activeTab === 'founder' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'founder' ? 700 : 500,
            }}
          >
            <User size={17} /> Founder Content
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
              setPasswordNotice('');
              setPasswordError('');
            }}
            className="admin-nav-item"
            style={{
              background: activeTab === 'security' ? '#efc75e' : 'transparent',
              color: activeTab === 'security' ? '#071020' : '#c5c9d4',
              fontWeight: activeTab === 'security' ? 700 : 500,
            }}
          >
            <Lock size={17} /> Update Password
          </button>
        </aside>

        {/* Content Pane */}
        <main className="admin-content">
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
              <div className="admin-stats-grid">
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
                <div className="admin-table-scroll">
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
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
                      {loadingEvents ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px 18px', color: '#666' }}>
                            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px', display: 'block', color: '#bd9636' }} />
                            Loading events & stories...
                          </td>
                        </tr>
                      ) : events.length > 0 ? (
                        events.map((evt) => (
                          <tr key={evt._id || evt.id} style={{ borderBottom: '1px solid #eee' }}>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '36px 18px', color: '#888', fontSize: '13px' }}>
                            No events currently in database. Click <strong>+ Add New Event</strong> above to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                    Contact Submissions
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                    Securely view and manage direct messages submitted by visitors.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                  <button
                    onClick={() => {
                      loadSubmissions(submissionFilter);
                      loadStats();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      border: '1px solid #071020',
                      background: '#071020',
                      color: '#efc75e',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <RefreshCw size={12} className={loadingSubmissions ? 'spinner' : ''} /> {loadingSubmissions ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {submissionError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    background: '#fdf2f2',
                    borderLeft: '4px solid #d9383a',
                    color: '#981b1d',
                    fontSize: '13px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{submissionError}</span>
                  <button
                    onClick={() => loadSubmissions(submissionFilter)}
                    style={{ marginLeft: 'auto', background: '#d9383a', color: '#fff', border: 0, padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {submissions.length === 0 ? (
                <div style={{ background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '10px' }}>
                  <Mail size={36} style={{ color: '#aaa', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#666' }}>No messages found in this category.</p>
                </div>
              ) : (
                <div className="admin-inquiries-grid">
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerDeleteSubmission(sub);
                              }}
                              title="Delete inquiry"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#a0a5ad',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#d9383a')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a5ad')}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
                    <div style={{ background: '#fff', borderRadius: '10px', padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <button
                          onClick={() => setSelectedSubmission(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f0f0f0',
                            border: 0,
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontSize: '11px',
                            color: '#555',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ← Back to inquiries list
                        </button>
                        <button
                          onClick={() => setSelectedSubmission(null)}
                          style={{ background: 'none', border: 0, color: '#888', cursor: 'pointer' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', margin: '0 0 4px' }}>
                          {selectedSubmission.name}
                        </h3>
                        <a href={`mailto:${selectedSubmission.email}`} style={{ fontSize: '13px', color: '#071020', fontWeight: 600, textDecoration: 'underline' }}>
                          {selectedSubmission.email}
                        </a>
                        {selectedSubmission.phone && (
                          <span style={{ fontSize: '13px', color: '#666', marginLeft: '12px' }}>
                            Phone: <a href={`tel:${selectedSubmission.phone}`}>{selectedSubmission.phone}</a>
                          </span>
                        )}
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
                          onClick={() => triggerDeleteSubmission(selectedSubmission)}
                          style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: '1px solid #d9383a',
                            color: '#d9383a',
                            padding: '8px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
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

                <div className="admin-form-row">
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

                <div className="admin-form-row">
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
                <div className="admin-form-row">
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

          {/* TAB 6: SECURITY / UPDATE PASSWORD */}
          {activeTab === 'security' && (
            <div style={{ maxWidth: '640px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#071020', margin: '0 0 6px' }}>
                  Update Administrator Password
                </h2>
                <p style={{ fontSize: '13px', color: '#666b76', margin: 0 }}>
                  Manage the primary login credentials for Saagar Foundation portal access.
                </p>
              </div>

              {passwordNotice && (
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
                    marginBottom: '20px',
                    borderRadius: '8px',
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: '#efc75e', flexShrink: 0 }} />
                  <span>{passwordNotice}</span>
                </div>
              )}

              {passwordError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    background: '#fdf2f2',
                    borderLeft: '4px solid #d9383a',
                    color: '#981b1d',
                    fontSize: '13px',
                    marginBottom: '20px',
                    borderRadius: '6px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form
                onSubmit={handleUpdatePassword}
                autoComplete="off"
                style={{
                  background: '#fff',
                  padding: '32px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071020', marginBottom: '8px' }}>
                    Current Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: '6px',
                        border: '1px solid #c9cec5',
                        fontSize: '13px',
                        background: '#faf8f2',
                        outline: 'none',
                        color: '#071020',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 0,
                        color: '#888',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071020', marginBottom: '8px' }}>
                    New Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: '6px',
                        border: '1px solid #c9cec5',
                        fontSize: '13px',
                        background: '#faf8f2',
                        outline: 'none',
                        color: '#071020',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      tabIndex={-1}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 0,
                        color: '#888',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '11px', color: '#888', marginTop: '6px', display: 'block' }}>
                    Must be at least 6 characters long.
                  </span>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071020', marginBottom: '8px' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #c9cec5',
                      fontSize: '13px',
                      background: '#faf8f2',
                      outline: 'none',
                      color: '#071020',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="button button-gold"
                  style={{ padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {savingPassword ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock size={15} /> Save New Password
                    </>
                  )}
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

                <div className="admin-form-row">
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

                <div className="admin-form-row">
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

                {/* MULTIPLE EVENT PHOTOS & GALLERY MANAGEMENT */}
                <div
                  style={{
                    marginBottom: '20px',
                    background: '#faf8f2',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #ebd8a7',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#071020', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={16} style={{ color: '#bd9636' }} />
                      Event Photos & Gallery ({eventForm.gallery?.length || 0}) *
                    </label>
                    <span style={{ fontSize: '11px', color: '#666' }}>
                      Select photos to show in the page gallery
                    </span>
                  </div>

                  {/* Actions: Multiple Upload Button + URL Input */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#071020',
                        color: '#efc75e',
                        padding: '9px 15px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: uploadingGallery ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        opacity: uploadingGallery ? 0.7 : 1,
                        flexShrink: 0,
                      }}
                    >
                      {uploadingGallery ? (
                        <>
                          <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                          Adding Photos...
                        </>
                      ) : (
                        <>
                          <Upload size={13} /> Upload Multiple Pictures
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingGallery}
                        style={{ display: 'none' }}
                        onChange={handleMultipleImageUpload}
                      />
                    </label>

                    <div style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '200px' }}>
                      <input
                        type="text"
                        placeholder="Or paste photo URL..."
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddGalleryUrl();
                          }
                        }}
                        style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '12px', background: '#fff' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        style={{
                          background: '#ebd8a7',
                          color: '#071020',
                          border: '1px solid #d4be88',
                          padding: '0 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Previews Grid */}
                  {eventForm.gallery && eventForm.gallery.length > 0 ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                        gap: '10px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        padding: '4px 2px',
                      }}
                    >
                      {eventForm.gallery.map((imgUrl, idx) => {
                        const isCover = eventForm.image === imgUrl || (!eventForm.image && idx === 0);
                        return (
                          <div
                            key={idx}
                            style={{
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              height: '84px',
                              border: isCover ? '2.5px solid #efc75e' : '1px solid #ddd',
                              boxShadow: isCover ? '0 0 10px rgba(239, 199, 94, 0.45)' : 'none',
                              background: '#040810',
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt={`Event photo ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />

                            {/* Cover Badge or Set as Cover Button */}
                            {isCover ? (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  left: '4px',
                                  background: '#efc75e',
                                  color: '#071020',
                                  fontSize: '8.5px',
                                  fontWeight: 900,
                                  padding: '2px 5px',
                                  borderRadius: '3px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                }}
                              >
                                <Star size={9} fill="#071020" /> COVER
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(imgUrl)}
                                title="Make this the cover photo"
                                style={{
                                  position: 'absolute',
                                  bottom: '4px',
                                  left: '4px',
                                  background: 'rgba(7, 16, 32, 0.85)',
                                  color: '#efc75e',
                                  border: 0,
                                  fontSize: '8.5px',
                                  fontWeight: 700,
                                  padding: '2px 5px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                }}
                              >
                                Set Cover
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              title="Delete this picture"
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(217, 56, 58, 0.95)',
                                color: '#fff',
                                border: 0,
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.15s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '18px 12px',
                        background: '#fff',
                        borderRadius: '6px',
                        border: '1px dashed #d5d5d5',
                        color: '#666',
                        fontSize: '12px',
                      }}
                    >
                      No pictures added yet. Click <strong>Upload Multiple Pictures</strong> or paste an image URL to add photos.
                    </div>
                  )}
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

                {/* Save Error Notice */}
                {eventSaveError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 14px',
                      background: '#fdf2f2',
                      borderLeft: '4px solid #d9383a',
                      color: '#981b1d',
                      fontSize: '12.5px',
                      marginBottom: '16px',
                      borderRadius: '4px',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{eventSaveError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    disabled={savingEvent}
                    onClick={() => setEventModalOpen(false)}
                    style={{ padding: '10px 16px', background: '#eee', border: 0, borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEvent || uploadingGallery}
                    className="button button-gold"
                    style={{
                      padding: '10px 22px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: (savingEvent || uploadingGallery) ? 'not-allowed' : 'pointer',
                      opacity: (savingEvent || uploadingGallery) ? 0.7 : 1,
                    }}
                  >
                    {savingEvent ? (
                      <>
                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        Saving Changes...
                      </>
                    ) : (
                      editingEvent ? 'Save Changes' : 'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE SUBMISSION CONFIRMATION MODAL */}
        {deleteTargetSubmission && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 120 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setDeleteTargetSubmission(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#071020',
                border: '1px solid rgba(239, 199, 94, 0.4)',
                borderRadius: '16px',
                padding: '36px 32px',
                maxWidth: '460px',
                width: '92%',
                color: '#fff',
                boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTargetSubmission(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 0,
                  color: '#9aa0a6',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(217, 56, 58, 0.15)',
                  border: '1px solid #d9383a',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 18px',
                  color: '#ff6b6d',
                }}
              >
                <Trash2 size={24} />
              </div>

              <h3
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '22px',
                  margin: '0 0 10px',
                  color: '#ffffff',
                }}
              >
                Confirm Delete Inquiry
              </h3>

              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#d1d5df', margin: '0 0 18px' }}>
                Are you sure you want to delete the message from{' '}
                <strong style={{ color: '#efc75e' }}>{deleteTargetSubmission.name}</strong> ({deleteTargetSubmission.email})? This action cannot be undone.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: '#efc75e',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 600,
                  }}
                >
                  Message Preview
                </span>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#c7c9d0',
                    margin: 0,
                    maxHeight: '65px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.5,
                  }}
                >
                  "{deleteTargetSubmission.message}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setDeleteTargetSubmission(null)}
                  style={{
                    padding: '11px 22px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteSubmission}
                  style={{
                    padding: '11px 22px',
                    background: '#d9383a',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={14} /> Yes, Delete Message
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* TOAST NOTIFICATION POP-UP */}
        {actionToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              zIndex: 200,
              background: '#071020',
              border: '1px solid #efc75e',
              borderRadius: '10px',
              padding: '14px 20px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#fff',
              maxWidth: '420px',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#efc75e', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', lineHeight: 1.4 }}>{actionToast}</span>
            <button
              onClick={() => setActionToast('')}
              style={{
                background: 'none',
                border: 0,
                color: '#888',
                cursor: 'pointer',
                padding: '2px',
                marginLeft: '8px',
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
