// API Configuration
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Production fallback - using the current Railway deployment URL
  return 'https://pronostika-platform-production.up.railway.app';
};

export const API_BASE_URL = getApiUrl();
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;