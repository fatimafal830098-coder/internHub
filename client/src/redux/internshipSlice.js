import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  internships: [],
  selectedInternship: null,
  loading: false,
  error: null,
};

const internshipSlice = createSlice({
  name: "internship",
  initialState,

  reducers: {
    setInternships: (state, action) => {
      state.internships = action.payload;
    },

    setSelectedInternship: (state, action) => {
      state.selectedInternship = action.payload;
    },

    addInternship: (state, action) => {
      state.internships.push(action.payload);
    },

    updateInternship: (state, action) => {
      const index = state.internships.findIndex(
        (internship) => internship._id === action.payload._id
      );

      if (index !== -1) {
        state.internships[index] = action.payload;
      }
    },

    removeInternship: (state, action) => {
      state.internships = state.internships.filter(
        (internship) => internship._id !== action.payload
      );
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
  setInternships,
  setSelectedInternship,
  addInternship,
  updateInternship,
  removeInternship,
  setLoading,
  setError,
} = internshipSlice.actions;

export default internshipSlice.reducer;