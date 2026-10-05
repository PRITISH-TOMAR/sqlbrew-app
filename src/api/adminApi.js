import api from './globalApi';
import { ApiResponse } from '../utils/classes/ApiResponse';

const DEFAULT_ERROR = 'Admin API error';

// ── User management ───────────────────────────────────────────────────────────

export const listUsers = async () => {
  try {
    const response = await api.get('/users');
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const getUserDetail = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/users/${userId}/status`, { status });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.patch(`/users/${userId}/role`, { newRole });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const updateUserPermissions = async (userId, grants, revokes) => {
  try {
    const response = await api.put(`/users/${userId}/permissions`, { grants, revokes });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

// ── Scope management (SUPERADMIN) ─────────────────────────────────────────────

export const listAdminScopes = async () => {
  try {
    const response = await api.get('/users/admin-scopes');
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

export const setAdminScope = async (adminId, moduleKey, grantableOps) => {
  try {
    const response = await api.put(`/users/admin-scopes/${adminId}`, { moduleKey, grantableOps });
    if (response.status === 200) return ApiResponse.success(response.data.message);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR);
  }
};

// ── Content reads ─────────────────────────────────────────────────────────────

export const adminGetTestCaseByQuestion = async (questionId) => {
  try {
    const res = await api.get(`/problems/${questionId}/testcases`);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminGetSolutionsByQuestion = async (questionId) => {
  try {
    const res = await api.get(`/problems/${questionId}/solutions`);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

// ── Content management ────────────────────────────────────────────────────────

export const adminCreateDataset = async (data) => {
  try {
    const res = await api.post(`/module/${data.dataType}/datasets`, data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateDataset = async (id, data) => {
  try {
    const res = await api.put(`/module/${data.dataType}/datasets/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteDataset = async (id, module) => {
  try {
    const res = await api.delete(`/module/${module}/datasets/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateQuestion = async (data) => {
  try {
    const res = await api.post(`/datasets/${data.datasetId}/problems`, data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateQuestion = async (id, data) => {
  try {
    const res = await api.patch(`/problems/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteQuestion = async (id) => {
  try {
    const res = await api.delete(`/problems/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateTestCase = async (data) => {
  try {
    const res = await api.post('/testcases', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateTestCase = async (id, data) => {
  try {
    const res = await api.put(`/testcases/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteTestCase = async (id) => {
  try {
    const res = await api.delete(`/testcases/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminGenerateTestCase = async (questionId, data) => {
  try {
    const res = await api.post(`/problems/${questionId}/testcases/generate`, data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminGenerateSolution = async (questionId, data) => {
  try {
    const res = await api.post(`/problems/${questionId}/solution/generate`, data);
    if (res.status === 200 || res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminCreateSolution = async (data) => {
  try {
    const res = await api.post('/solutions', data);
    if (res.status === 201) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminUpdateSolution = async (id, data) => {
  try {
    const res = await api.put(`/solutions/${id}`, data);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};

export const adminDeleteSolution = async (id) => {
  try {
    const res = await api.delete(`/solutions/${id}`);
    if (res.status === 200) return ApiResponse.success(res.data.message);
    return ApiResponse.error(res.data.message);
  } catch (e) { return ApiResponse.error(e.response?.data?.message || DEFAULT_ERROR); }
};
