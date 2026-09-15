import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import api from "../api";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");

      return response.data.user || response.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;