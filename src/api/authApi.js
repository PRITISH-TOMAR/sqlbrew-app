// REACT MODULES

// IMPORTS
import { store } from '../redux/store';
import { ApiResponse } from '../utils/classes/ApiResponse';
import { setLoading, setUser, logout } from '../redux/slices/authSlice';
import api from "./globalApi"

// UTILITIES
import toast from 'react-hot-toast';

const DEFAULT_ERROR_MESSAGE = `Can not connect to the server`


export const loginUser = async (payload) => {
  try {
    const url = `/auth/login`;
    const response = await api.post(url, payload);

    if (response.status == 200) {
      const { user, tokenDetails } = response.data.data;
      store.dispatch(setUser({ user, tokenDetails }));
      toast.success(response.data.message);
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message, response.data.data);
    }

  } catch (error) {
    toast.error(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const signupUser = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const url = `/auth/register`;
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
    toast.error(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const sendVerificationLink = async (email) => {
  try {
    const url = `/auth/send?email=${email}`;
    const response = await api.get(url);
    if (response.status == 200) {
      toast.success(response.data.message || 'Verification link sent');
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message);
      return ApiResponse.error(response.data.message, response.data.data);
    }
  } catch (error) {
    toast.error(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
};

export const verifyEmailLink = async (token) => {
  try {
    const url = `/auth/verify?token=${token}`;
    const response = await api.get(url);
    if (response.status == 200) {
      toast.success(response.data.message);
      return ApiResponse.success(response.data.message, response.data.data);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message, response.data.data);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const url = `/auth/forgot-password`;
    const response = await api.post(url, { email });

    if (response.status == 200) {
      toast.success(response.data?.message);
      return ApiResponse.success(response.data.message);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.data?.message);
    return ApiResponse.error(error.message);
  }
};

export const resetPassword = async (payload) => {
  try {
    const url = `/auth/reset-password`;
    const response = await api.post(url, payload);

    if (response.status == 200) {
      toast.success(response.data?.message);
      return ApiResponse.success(response.data.message);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data.message);
    return ApiResponse.error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (_) {
    // best-effort — clear local state regardless of API result
  }
  store.dispatch(logout());
  toast.success('Logged out successfully');
};

export const pingResetPassword = async (resetKey) => {
  try {
    const url = `/auth/reset-ping/${resetKey}`;
    const response = await api.get(url);
    if (response.status == 200) {
      return ApiResponse.success(response.data.message);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data?.message);
    }
  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || DEFAULT_ERROR_MESSAGE;
    toast.error(errMessage);
    return ApiResponse.error(errMessage);
  }
};