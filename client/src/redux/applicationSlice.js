import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,

  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },

    addApplication: (state, action) => {
      state.applications.push(action.payload);
    },

    updateApplication: (state, action) => {
      const index = state.applications.findIndex(
        (application) => application._id === action.payload._id
      );

      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  setLoading,
  setError,
} = applicationSlice.actions;

export default applicationSlice.reducer;