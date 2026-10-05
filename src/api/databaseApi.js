// REACT MODULES

// IMPORTS
import { store } from '../redux/store';
import { ApiResponse } from '../utils/classes/ApiResponse';
import { setLoading } from '../redux/slices/authSlice';
import api from "./globalApi"

// UTILITIES
import toast from 'react-hot-toast';

const DEFAULT_ERROR_MESSAGE = `Can not connect to the server`


export const loadDatasetsByModule = async (module, payload) => {
  try {
    const response = await api.get(`/module/${module}/datasets`, {
      params: { page: payload.page, size: payload.size, search: payload.search || '' }
    });
    if (response.status === 200) return ApiResponse.success(response.data.message, response.data.data);
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const loadNoSQLDatasets = async (payload) => {
  try {
    const response = await api.get(`/module/NOSQL/datasets`, {
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
    const response = await api.get(`/module/VECTORDB/datasets`, {
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
    const url = `/module/SQL/datasets`;

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

export const loadDatasetDetails = async (payloadId, module = 'SQL') => {
  try {
    const url = `/module/${module}/datasets/${payloadId}`;

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
    const response = await api.get(`/problems/${problemId}`);
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

export const runSQLQuery = async (questionId, query, sqlMode) => {
  try {
    const response = await api.post(`/sql/run`, { questionId, query, sqlMode });
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

export const submitSQLQuery = async (questionId, query, sqlMode) => {
  try {
    const response = await api.post(`/sql/execute`, { questionId, query, sqlMode });
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
    const url = `/datasets/${payloadId}/problems`;

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
