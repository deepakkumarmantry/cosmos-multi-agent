/**
 * API Configuration File
 * 
 * This file contains the configuration for API endpoints.
 * Update these values to connect to your backend service.
 */

// Default environment variables with fallbacks (using Python server values from example)
const API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '8000';
const API_PROTOCOL = process.env.REACT_APP_API_PROTOCOL || 'http';
// Using /api/v1 prefix as requested
const API_BASE_PATH = process.env.REACT_APP_API_BASE_PATH || '/api/v1';

// Construct the base URL
export const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}${API_BASE_PATH}`;

// API endpoints for cosmos-support
export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/cosmos-support`,
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

/**
 * Configure global fetch options
 * @returns {Object} Default fetch options
 */
export const getDefaultFetchOptions = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'omit', // Don't send credentials for CORS
  mode: 'cors', // This ensures CORS is used properly
});

// Export as named configuration object to avoid ESLint warning
const apiConfig = {
  API_BASE_URL,
  ENDPOINTS,
  REQUEST_TIMEOUT,
  getDefaultFetchOptions,
};

export default apiConfig;