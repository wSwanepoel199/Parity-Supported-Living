import { configureStore } from "@reduxjs/toolkit";
import { backendApi } from '../utils/api';
import rootReducer from './root/rootSlice';
import userReducer from './user/userSlice';
import postReducer from './posts/postSlice';
// import { userMiddleware } from "../utils/middleware";

// const middleware = [userMiddleware];

export default configureStore({
  reducer: {
    [backendApi.reducerPath]: backendApi.reducer,
    root: rootReducer,
    user: userReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),

});