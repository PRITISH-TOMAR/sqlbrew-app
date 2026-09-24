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

// ── Content management ────────────────────────────────────────────────────────

export const adminCreateDataset = async (data) => {
  try {
    const res = await api.post('/admin/content/dataset', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateDataset = async (id, data) => {
  try {
    const res = await api.put(`/admin/content/dataset/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteDataset = async (id) => {
  try {
    const res = await api.delete(`/admin/content/dataset/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateQuestion = async (data) => {
  try {
    const res = await api.post('/admin/content/question', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateQuestion = async (id, data) => {
  try {
    const res = await api.put(`/admin/content/question/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteQuestion = async (id) => {
  try {
    const res = await api.delete(`/admin/content/question/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateTestCase = async (data) => {
  try {
    const res = await api.post('/admin/content/testcase', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateTestCase = async (id, data) => {
  try {
    const res = await api.put(`/admin/content/testcase/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteTestCase = async (id) => {
  try {
    const res = await api.delete(`/admin/content/testcase/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateSolution = async (data) => {
  try {
    const res = await api.post('/admin/content/solution', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateSolution = async (id, data) => {
  try {
    const res = await api.put(`/admin/content/solution/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteSolution = async (id) => {
  try {
    const res = await api.delete(`/admin/content/solution/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};
