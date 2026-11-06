const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Custom error class to store detailed error messages from Rails backend
 */
export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Retrieves the stored JWT token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Saves auth session in localStorage
 */
export function setAuthSession(token, user) {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clears auth session
 */
export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Returns stored user object or null
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Helper to perform fetch requests with auth headers and unified error parsing
 */
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  // Parse body safely
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `Error del servidor (${response.status})`;
    let details = null;

    if (data) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        details = data.errors;
        errorMessage = data.errors.join('. ');
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      }
    }

    throw new ApiError(errorMessage, response.status, details);
  }

  return data;
}

export const api = {
  // Auth
  register: (email, password, passwordConfirmation) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
    }),

  login: (email, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Courts
  getCourts: () => request('/courts'),

  getCourtById: (id) => request(`/courts/${id}`),

  getTimeSlots: (courtId, date) => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/courts/${courtId}/time_slots${query}`);
  },

  // Reservations (Protected)
  getReservations: () => request('/reservations'),

  createReservation: ({ court_id, time_slot_id, date }) =>
    request('/reservations', {
      method: 'POST',
      body: JSON.stringify({
        reservation: {
          court_id: Number(court_id),
          time_slot_id: Number(time_slot_id),
          date,
        },
      }),
    }),

  cancelReservation: (id) =>
    request(`/reservations/${id}`, {
      method: 'DELETE',
    }),
};

