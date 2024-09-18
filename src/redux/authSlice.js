import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await api.login(credentials);
  return response.data;
});

export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await api.register(userData);
  return response.data;
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email) => {
  const response = await api.forgotPassword(email);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(login.rejected, (state, action) => { state.error = action.error.message; state.loading = false; });
  }
});

export default authSlice.reducer;
