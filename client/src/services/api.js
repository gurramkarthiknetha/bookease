import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  updateUserRole: (id, role) => api.patch(`/users/${id}`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Book API
export const bookAPI = {
  getAllBooks: (params) => api.get('/books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.patch(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

// Reservation API
export const reservationAPI = {
  getAllReservations: () => api.get('/reservations'),
  getUserReservations: () => api.get('/reservations/my-reservations'),
  getReservationById: (id) => api.get(`/reservations/${id}`),
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  updateReservationStatus: (id, status) => api.patch(`/reservations/${id}`, { status }),
};

// Review API
export const reviewAPI = {
  getBookReviews: (bookId) => api.get(`/reviews/book/${bookId}`),
  getUserReviews: () => api.get('/reviews/my-reviews'),
  getReviewById: (id) => api.get(`/reviews/${id}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.patch(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default api;
