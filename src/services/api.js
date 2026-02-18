// Backend API URL (Railway deployment)
// If VITE_API_URL is not set, use production URL in production mode, or localhost in development
const PROD_API_URL = 'https://tka-ardhi-production.up.railway.app/api';
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PROD_API_URL : 'http://localhost:3000');

console.log(`🌐 Using API URL: ${API_BASE_URL}`);

// OPTIMIZATION: In-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * API helper functions for the LMS
 */
class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get authorization headers
   */
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      // Try to parse error message from JSON response
      let errorMessage = 'Terjadi kesalahan pada server';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback for non-JSON errors
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }

      if (response.status === 401) {
        // Token expired or invalid
        console.warn('⚠️ Token expired or invalid. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Show alert before redirect
        // alert('Sesi Anda telah berakhir. Silakan login kembali.'); // Removed alert to prevent loop

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      throw new Error(errorMessage);
    }

    // Success response
    try {
      return await response.json();
    } catch (e) {
      return {}; // Return empty object for empty responses (204)
    }
  }

  /**
   * Make GET request with caching
   */
  async get(endpoint, useCache = true) {
    // Check cache first
    if (useCache && cache.has(endpoint)) {
      const { data, timestamp } = cache.get(endpoint);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log(`📦 Cache hit: ${endpoint}`);
        return data;
      }
      // Cache expired, remove it
      cache.delete(endpoint);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse(response);

      // Store in cache
      if (useCache) {
        cache.set(endpoint, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      // Fetch only rejects on network failure
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    }
  }

  /**
   * Make POST request
   */
  async post(endpoint, body) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (POST ${endpoint}):`, error);
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    }
  }

  /**
   * Make PUT request
   */
  async put(endpoint, body) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      throw new Error(error.message === 'Failed to fetch' ? 'Gagal terhubung ke server. Periksa koneksi internet Anda.' : error.message);
    }
  }

  /**
   * Make DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    }
  }

  /**
   * Clear cache for specific pattern or all cache
   */
  clearCache(pattern = null) {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      cache.clear();
    }
  }

  // =====================
  // Auth Endpoints
  // =====================

  async register(name, email, password, role = 'student') {
    return this.post('/auth/register', { name, email, password, role });
  }

  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async getProfile() {
    return this.get('/auth/me');
  }

  async refreshToken() {
    return this.post('/auth/refresh', {});
  }

  // =====================
  // Course Endpoints
  // =====================

  async getCourses(page = 1, limit = 10, category = '') {
    let url = `/courses?page=${page}&limit=${limit}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return this.get(url);
  }

  async getCourse(id) {
    return this.get(`/courses/${id}`);
  }

  async getCategories() {
    return this.get('/courses/categories');
  }

  async createCourse(courseData) {
    const result = await this.post('/courses', courseData);
    this.clearCache('/courses'); // Invalidate courses cache
    return result;
  }

  async addModule(courseId, title, order) {
    const result = await this.post(`/courses/${courseId}/modules`, { title, order });
    this.clearCache(`/courses/${courseId}`); // Invalidate specific course cache
    return result;
  }

  // =====================
  // Lesson Endpoints
  // =====================

  async getLesson(id) {
    return this.get(`/lessons/${id}`);
  }

  async createLesson(lessonData) {
    const result = await this.post('/lessons', lessonData);
    this.clearCache('/courses'); // Invalidate courses cache
    return result;
  }

  async addQuizQuestions(lessonId, questions) {
    return this.post(`/lessons/${lessonId}/quizzes`, { questions });
  }

  // =====================
  // Quiz Endpoints
  // =====================

  async getQuiz(lessonId) {
    return this.get(`/quiz/lesson/${lessonId}`);
  }

  async submitQuiz(lessonId, answers) {
    return this.post('/quiz/submit', { lesson_id: lessonId, answers });
  }

  // =====================
  // Progress Endpoints
  // =====================

  async getProgress(userId) {
    return this.get(`/progress/${userId}`);
  }

  async getCourseProgress(courseId) {
    return this.get(`/progress/course/${courseId}`);
  }
}

// Export singleton instance
const api = new ApiService();
export default api;
