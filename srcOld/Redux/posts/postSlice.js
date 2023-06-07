import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep'
};

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    savePosts: (state, action) => {
      return {
        ...state,
        posts: action.payload,
        status: "successful"
      };
    },
    clearPostState: () => {
      return {
        ...initialState
      };
    }
  },
});

export const { savePosts, clearPostState } = postSlice.actions;

export default postSlice.reducer;