import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    
    if (username && password) {
      config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors globally
    if (error.response && error.response.status === 401) {
      // Authentication failed
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      
      // Handle redirect to login page if appropriate for your application
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;