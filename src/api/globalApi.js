import axios from 'axios';
import { store } from '../redux/store';
import { logout, setNewTokenDetails } from '../redux/slices/authSlice';
import { recordApiFailure, recordApiSuccess } from '../redux/slices/apiErrorSlice';

const MAX_RETRIES = 3;

const shouldRetry = (error) => {
  if (error.config?._skipRetry) return false;
  if (!error.response) return true; // network / timeout
  return error.response.status >= 500;  // server errors
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token from Redux store
api.interceptors.request.use(
  (config) => {
    const token = store.getState()?.auth?.tokenDetails?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and dispatch Redux actions
api.interceptors.response.use(
  (response) => {
    store.dispatch(recordApiSuccess());
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // --- Retry logic (network errors and 5xx) ---
    if (shouldRetry(error)) {
      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
      if (originalRequest._retryCount < MAX_RETRIES) {
        return api(originalRequest);
      }
      // Exhausted all retries — record a consecutive failure
      store.dispatch(recordApiFailure());
      return Promise.reject(error);
    }

    if (!error.response) {
      store.dispatch(recordApiFailure());
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // --- 401 / token refresh ---
    if (status === 401 && !originalRequest._retry) {
      if (data.error === "EXPIRED") {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }
    if (status === 401) {
      store.dispatch(logout());
    }

    // 4xx errors are expected business errors — record failure for consecutive tracking
    store.dispatch(recordApiFailure());
    return Promise.reject(error);
  }
);

// FUNCTION : REFRESH ACCESS TOKEN
const refreshAccessToken = async () => {

  const tokenDetails = store.getState()?.auth?.tokenDetails;
  const refreshToken = tokenDetails.refreshToken;

  try {

    const response = await api.get(`/auth/refresh/${refreshToken}`);

    const accessToken = response.data?.data.accessToken;
    store.dispatch(setNewTokenDetails({...tokenDetails, accessToken}));
    return accessToken;
  } catch (e) {
    return e;
  }
};



export default api;