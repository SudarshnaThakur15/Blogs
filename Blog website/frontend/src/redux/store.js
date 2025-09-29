import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import blogReducer from '../features/blogListing/blogSlice';

const store = configureStore({
  reducer: {
    auth: authReducer ,
    blog: blogReducer
  }
});

export default store;
