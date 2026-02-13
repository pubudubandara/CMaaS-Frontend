import axios from 'axios';

// Create an instance
const api = axios.create({
  // If you are running .NET locally, it might be http://localhost:5000/api
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Force redirect in standard React
    }
    return Promise.reject(error);
  }
);

export default api;