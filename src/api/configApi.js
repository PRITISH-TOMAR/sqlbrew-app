import api from './globalApi';
import { ApiResponse } from '../utils/classes/ApiResponse';
import { store } from '../redux/store';
import { setConfig, setConfigLoading, incrementConfigRetry, clearConfig } from '../redux/slices/configSlice';

const DEFAULT_ERROR_MESSAGE = 'Could not load configuration';

export const fetchUserConfig = async () => {
  // Guard: don't fire if already in-flight (prevents concurrent calls)
  if (store.getState().config.loading) return;

  store.dispatch(setConfigLoading());
  try {
    const response = await api.get('/config');
    if (response.status === 200) {
      store.dispatch(setConfig(response.data.data));
      return ApiResponse.success(response.data.message, response.data.data);
    }
    store.dispatch(incrementConfigRetry());
    return ApiResponse.error(response.data.message);
  } catch (error) {
    // incrementConfigRetry causes App.jsx useEffect to re-run and retry
    // until MAX_CONFIG_RETRIES is reached — covers 4xx, 5xx, and network errors
    store.dispatch(incrementConfigRetry());
    return ApiResponse.error(error.response?.data?.message || DEFAULT_ERROR_MESSAGE);
  }
};

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
