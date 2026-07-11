import axios from 'axios';
import { API_URL } from '../utils/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

function shouldRetry(error) {
  if (!error.response) return true;
  const status = error.response.status;
  return status >= 500 || status === 429;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(normalizeError(error));

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount < MAX_RETRIES && shouldRetry(error)) {
      config.__retryCount += 1;
      await delay(RETRY_DELAY_MS * config.__retryCount);
      return api(config);
    }

    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error) {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.response?.status === 404) {
    return new Error('Resource not found.');
  }
  if (!error.response) {
    return new Error('Network error. Please check your connection and ensure the API server is running.');
  }
  return new Error(error.message || 'An unexpected error occurred.');
}

export default api;
