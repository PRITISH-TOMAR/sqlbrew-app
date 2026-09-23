import api from './globalApi';
import { ApiResponse } from '../utils/classes/ApiResponse';

const DEFAULT_ERROR_MESSAGE = 'Could not load configuration';

export const fetchPageConfig = async (pageKey) => {
  try {
    const response = await api.get(`/config/page/${pageKey}`);
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
  }
};

export const fetchDatasetGridConfig = async () => {
  try {
    const response = await api.get('/config/dataset-grid');
    if (response.status === 200) {
      return ApiResponse.success(response.data.message, response.data.data);
    }
    return ApiResponse.error(response.data.message);
  } catch (error) {
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
  }
};
