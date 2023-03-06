import { configureStore } from "@reduxjs/toolkit";
import { backendApi } from "./api/backendApi";
import rootReducer from './root/rootSlice';
import userReducer from './user/userSlice';
import postReducer from './posts/postSlice';
import adminReducer from './admin/adminSlice';
import clientReducer from './client/clientSlice';
// import { userMiddleware } from "../utils/middleware";

// const middleware = [userMiddleware];

export default configureStore({
  reducer: {
    [backendApi.reducerPath]: backendApi.reducer,
    root: rootReducer,
    user: userReducer,
    posts: postReducer,
    admin: adminReducer,
    clients: clientReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),

});