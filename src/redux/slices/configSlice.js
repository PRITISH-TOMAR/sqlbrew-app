import { createSlice } from '@reduxjs/toolkit';

const MAX_CONFIG_RETRIES = 3;

const configSlice = createSlice({
  name: 'config',
  initialState: {
    data:       null,
    loading:    false,
    loaded:     false,
    retryCount: 0,
  },
  reducers: {
    setConfigLoading(state) {
      state.loading = true;
    },
    setConfig(state, action) {
      state.data       = action.payload;
      state.loading    = false;
      state.loaded     = true;
      state.retryCount = 0;
    },
    incrementConfigRetry(state) {
      state.loading    = false;
      state.loaded     = false;
      state.retryCount += 1;
    },
    clearConfig(state) {
      state.data       = null;
      state.loading    = false;
      state.loaded     = false;
      state.retryCount = 0;
    },
  },
});

export { MAX_CONFIG_RETRIES };
export const { setConfigLoading, setConfig, incrementConfigRetry, clearConfig } = configSlice.actions;
export default configSlice.reducer;
