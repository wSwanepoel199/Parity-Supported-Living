import { createSlice } from "@reduxjs/toolkit";

const initialState = {
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      console.log(state.user, action.payload);
      return action.payload;
    },
    removeUser: (state) => {
      return initialState;
    }
  }
});

export const { saveUser, removeUser } = userSlice.actions;

export default userSlice.reducer;