import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  tokenDetails: null,
  isAuthenticated: false,
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user ? action.payload.user : {};
      state.tokenDetails = action.payload.tokenDetails;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.tokenDetails = null;
      state.isAuthenticated = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setNewTokenDetails(state, action) {
      state.tokenDetails = action.payload
    }
  },
});

export const { setUser, logout, setLoading, setNewTokenDetails } = authSlice.actions;
export default authSlice.reducer;
