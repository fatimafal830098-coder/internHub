import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import internshipReducer from "./internshipSlice";
import applicationReducer from "./applicationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    internship: internshipReducer,
    application: applicationReducer,
  },
});

export default store;