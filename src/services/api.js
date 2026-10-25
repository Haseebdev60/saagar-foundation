// API service layer for Saagar Foundation

const BASE_URL = '/api';

function getAuthHeaders(includeContentType = true) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('saagar_auth_token') : null;
  const headers = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Events
  async getEvents(category) {
    const url = category && category !== 'All Stories' && category !== 'All'
      ? `${BASE_URL}/events?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/events`;
    return handleResponse(await fetch(url));
  },

  async getEventByIdOrSlug(idOrSlug) {
    return handleResponse(await fetch(`${BASE_URL}/events/detail/${encodeURIComponent(idOrSlug)}`));
  },

  async getAllEventsAdmin() {
    return handleResponse(
      await fetch(`${BASE_URL}/events/admin/all`, {
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  async createEvent(eventData) {
    return handleResponse(
      await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(eventData),
      })
    );
  },

  async updateEvent(id, eventData) {
    return handleResponse(
      await fetch(`${BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(eventData),
      })
    );
  },

  async deleteEvent(id) {
    return handleResponse(
      await fetch(`${BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  // Contact
  async submitContact(formData) {
    return handleResponse(
      await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    );
  },

  async getSubmissionsAdmin(status) {
    const url = status ? `${BASE_URL}/contact/admin/all?status=${status}` : `${BASE_URL}/contact/admin/all`;
    return handleResponse(
      await fetch(url, {
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  async updateSubmissionStatus(id, statusData) {
    return handleResponse(
      await fetch(`${BASE_URL}/contact/admin/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(statusData),
      })
    );
  },

  async deleteSubmission(id) {
    return handleResponse(
      await fetch(`${BASE_URL}/contact/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  // Donation info
  async getDonationInfo() {
    return handleResponse(await fetch(`${BASE_URL}/donation-info`));
  },

  async updateDonationInfo(data) {
    return handleResponse(
      await fetch(`${BASE_URL}/donation-info`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      })
    );
  },

  // Founder info
  async getFounderInfo() {
    return handleResponse(await fetch(`${BASE_URL}/founder-info`));
  },

  async updateFounderInfo(data) {
    return handleResponse(
      await fetch(`${BASE_URL}/founder-info`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      })
    );
  },

  // Auth
  async login(credentials) {
    const res = await handleResponse(
      await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
    );
    if (res.token) {
      localStorage.setItem('saagar_auth_token', res.token);
    }
    return res;
  },

  async logout() {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('saagar_auth_token');
    }
    return { success: true };
  },

  async getMe() {
    return handleResponse(
      await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  async getDashboardStats() {
    return handleResponse(
      await fetch(`${BASE_URL}/auth/dashboard-stats`, {
        headers: getAuthHeaders(false),
        credentials: 'include',
      })
    );
  },

  async updatePassword(passwordData) {
    return handleResponse(
      await fetch(`${BASE_URL}/auth/update-password`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(passwordData),
      })
    );
  },

  // Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return handleResponse(
      await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        credentials: 'include',
        body: formData,
      })
    );
  },
};
