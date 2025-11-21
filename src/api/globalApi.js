import axios from 'axios';
import { store } from '../redux/store';
import { logout, setNewTokenDetails } from '../redux/slices/authSlice';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error);
    }
    const { status, data } = error.response;
    if (status === 401 && !originalRequest._retry) {
      if (data.error === "EXPIRED") {
        originalRequest._retry = true;
        try {
          // Refresh token
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
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
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