import { createSlice } from "@reduxjs/toolkit";

const isPending = (action) => {
  // console.log(action);
  // console.log(action.meta?.arg.endpointName);
  return action.type.endsWith('pending');
};

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
  extraReducers(builder) {
    builder
      .addMatcher(isPending, (state, action) => {
        if (action.meta?.arg.endpointName.includes("Posts")) {
          console.log(action.meta?.arg.endpointName);
          return {
            ...state,
            status: 'loading'
          };
        } else {
          return;
        }
      });
  }
});


export const { savePosts, clearPostState } = postSlice.actions;

export default postSlice.reducer;