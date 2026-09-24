import api from './globalApi';
import { ApiResponse } from '../utils/classes/ApiResponse';

const DEFAULT_ERROR = 'Admin API error';

// ── User management ───────────────────────────────────────────────────────────

export const listUsers = async () => {
  try {
    const response = await api.post('/admin/users/list');
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const getUserDetail = async (userId) => {
  try {
    const response = await api.post('/admin/users/detail', { userId });
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.post('/admin/users/status', { userId, status });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.post('/admin/users/role', { userId, newRole });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserPermissions = async (userId, grants, revokes) => {
  try {
    const response = await api.post('/admin/users/permissions', { userId, grants, revokes });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

// ── Scope management (SUPERADMIN) ─────────────────────────────────────────────

export const listAdminScopes = async () => {
  try {
    const response = await api.get('/superadmin/scopes');
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const setAdminScope = async (adminId, moduleKey, grantableOps) => {
  try {
    const response = await api.post('/superadmin/scopes', { adminId, moduleKey, grantableOps });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};
