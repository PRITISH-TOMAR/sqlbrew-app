import api from './globalApi';
import { ApiResponse } from '../utils/classes/ApiResponse';
import toast from 'react-hot-toast';

const ERR = 'Cannot connect to the server';

export const loadUserProfile = async (userId) => {
  try {
    const res = await api.get(`/user/${userId}/profile`);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    toast.error(res.data.message || ERR);
    return ApiResponse.error(res.data.message);
  } catch (e) {
    toast.error(e.response?.data?.message || ERR);
    return ApiResponse.error(e.message);
  }
};

export const loadUserStats = async (userId, period = 'all') => {
  try {
    const res = await api.get(`/user/${userId}/stats`, { params: { period } });
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    toast.error(res.data.message || ERR);
    return ApiResponse.error(res.data.message);
  } catch (e) {
    toast.error(e.response?.data?.message || ERR);
    return ApiResponse.error(e.message);
  }
};

export const loadUserSubmissions = async (userId, params = {}) => {
  try {
    const res = await api.get(`/user/${userId}/submissions`, { params });
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    toast.error(res.data.message || ERR);
    return ApiResponse.error(res.data.message);
  } catch (e) {
    toast.error(e.response?.data?.message || ERR);
    return ApiResponse.error(e.message);
  }
};

export const loadUserHeatmap = async (userId) => {
  try {
    const res = await api.get(`/user/${userId}/heatmap`);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    toast.error(res.data.message || ERR);
    return ApiResponse.error(res.data.message);
  } catch (e) {
    toast.error(e.response?.data?.message || ERR);
    return ApiResponse.error(e.message);
  }
};
