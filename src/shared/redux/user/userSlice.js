import { createSlice } from "@reduxjs/toolkit";
import { fetchStoredToken, removeStoredToken, storeAuthToken } from "../../utils/authToken";

const initialState = {
  user: {},
  authToken: fetchStoredToken() || ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeUser: (state) => {
      removeStoredToken();
      return {
        ...initialState,
        authToken: ''
      };
    },
    saveUser: (state, action) => {
      return {
        ...state,
        user: action.payload
      };
    },
    saveToken: (state, action) => {
      storeAuthToken(action.payload);
      return {
        ...state,
        authToken: action.payload
      };
    }
  }
});

export const { saveUser, removeUser, saveToken } = userSlice.actions;

export default userSlice.reducer;