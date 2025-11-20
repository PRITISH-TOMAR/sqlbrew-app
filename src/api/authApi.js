// REACT MODULES
import axios from 'axios';

// IMPORTS
import { store } from '../redux/store';
import { ApiResponse } from '../utils/classes/ApiResponse';
import { logout, setLoading, setUser } from '../redux/slices/authSlice';

// UTILITIES
import toast from 'react-hot-toast';

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
    const state = store.getState();
    const token = state.auth.authToken;

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
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (payload) => {
  try {
    const url = `/user/login`;
    const response = await api.post(url, payload);
    const { user, tokenDetails } = response.data.data;
    store.dispatch(setUser({ user, tokenDetails }));
    if (response.status == 200) {
      toast.success(response.data.message);
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message);
      return ApiResponse.error(response.data.message, response.data.data);
    }

  } catch (error) {
    toast.error(error.response.data.message);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const signupUser = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const url = `/user/register`;
    const response = await api.post(url, payload);

    if (response.status == 201) {
      toast.success(response.data.message);
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message);
      return ApiResponse.error(response.data.message, response.data.data);

    }
  } catch (error) {
    toast.error(error.response.data.message);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const sendOtpToMail = async (payload) => {
  try {
    const url = `/auth/send?email=${payload}`;
    const response = await api.get(url);
    console.log(response);
    if (response.status == 200) {
      toast.success(response.data.message || 'OTP sent successfully');
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message);
      return ApiResponse.error(response.data.message, response.data.data);

    }
  } catch (error) {
    toast.error(error.response.data.message);
    return ApiResponse.error(error.message);
  }
};

export const verifyEmail = async (payload) => {
  try {
    const url = `/auth/verify`;
    const response = await api.post(url, payload);
    console.log(response);
    if (response.status == 200) {
      toast.success(response.data.message);
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message);
      return ApiResponse.error(response.data.message, response.data.data);

    }
  } catch (error) {
    toast.error(error.response.data.message);
    return ApiResponse.error(error.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return {
      success: true,
      message: response.data.message || 'Password reset email sent'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send reset email.',
      error: error.response?.data
    };
  }
};

export const resetPassword = async (payload) => {
  try {
    const response = await api.post('/auth/reset-password', payload);
    return {
      success: true,
      message: response.data.message || 'Password reset successful'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Password reset failed.',
      error: error.response?.data
    };
  }
};