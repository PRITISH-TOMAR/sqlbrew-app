import { createSlice } from '@reduxjs/toolkit';

const apiErrorSlice = createSlice({
  name: 'apiError',
  initialState: { consecutiveFailures: 0 },
  reducers: {
    recordApiFailure: (state) => {
      state.consecutiveFailures += 1;
    },
    recordApiSuccess: (state) => {
      state.consecutiveFailures = 0;
    },
    dismissApiError: (state) => {
      state.consecutiveFailures = 0;
    },
  },
});

export const { recordApiFailure, recordApiSuccess, dismissApiError } = apiErrorSlice.actions;
export default apiErrorSlice.reducer;
