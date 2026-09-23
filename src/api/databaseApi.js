// REACT MODULES

// IMPORTS
import { store } from '../redux/store';
import { ApiResponse } from '../utils/classes/ApiResponse';
import { setLoading } from '../redux/slices/authSlice';
import api from "./globalApi"

// UTILITIES
import toast from 'react-hot-toast';

const DEFAULT_ERROR_MESSAGE = `Can not connect to the server`


export const loadNoSQLDatasets = async (payload) => {
  try {
    const response = await api.get(`/db/nosql/all`, {
      params: { page: payload.page, size: payload.size, search: payload.search || '' }
    });
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const loadVectorDBDatasets = async (payload) => {
  try {
    const response = await api.get(`/db/vectordb/all`, {
      params: { page: payload.page, size: payload.size, search: payload.search || '' }
    });
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const loadSQLDatasets = async (payload) => {
  try {
    const url = `/db/sql/all`;

    const response = await api.get(url, {
      params: {
        page: payload.page,
        size: payload.size,
        search: payload.search || ""
      }
    });

    if (response.status === 200) {

      const { data, message } = response.data;
      return ApiResponse.success(message, data);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message, response.data.data);
    }

  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const loadDatasetDetails = async (payloadId) => {
  try {
    const url = `/db/sql/${payloadId}`;

    const response = await api.get(url);

    if (response.status === 200) {

      const { data, message } = response.data;
      return ApiResponse.success(message, data);
    }
    else {
      toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
      return ApiResponse.error(response.data.message, response.data.data);
    }

  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
  finally {
    store.dispatch(setLoading(false));
  }
};

export const loadProblemDetails = async (problemId) => {
  try {
    const response = await api.get(`/db/sql/problem/${problemId}`);
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
};

export const runSQLQuery = async (questionId, query) => {
  try {
    const response = await api.post(`/sql/run`, { questionId, query });
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
};

export const submitSQLQuery = async (questionId, query) => {
  try {
    const response = await api.post(`/sql/execute`, { questionId, query });
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    toast.error(response.data.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
    return ApiResponse.error(error.message);
  }
};

export const getJobResult = async (jobId) => {
  try {
    const response = await api.get(`/result/${jobId}`);
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.message);
  }
};

export const loadExpectedOutput = async (questionId) => {
  try {
    const response = await api.get(`/db/sql/problem/${questionId}/expected`);
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.message);
  }
};


export const loadSQLQuestionSet = async (payloadId) => {
  try {
    const url = `/db/sql/${payloadId}/problems`;

    const response = await api.get(url);

    if (response.status === 200) {

      const { data, message } = response.data;
      return ApiResponse.success(message, data);
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
