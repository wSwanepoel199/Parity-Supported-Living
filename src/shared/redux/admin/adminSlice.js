import { createSlice } from "@reduxjs/toolkit";
import { } from "../../utils/authToken";

const initialState = {
  users: undefined,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    saveUsers: (state, action) => {
      return {
        ...state,
        users: action.payload
      };
    },
    clearUsers: () => {
      return initialState;
    }
  },
});

export const { saveUsers, clearUsers } = adminSlice.actions;

export default adminSlice.reducer;