import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep',
};

const isPending = (action) => {
  return action.type.endsWith('pending');
};

const isFulfilled = (action) => {
  return action.type.endsWith('fulfilled');
};

const isRejected = (action) => {
  return action.type.endsWith('rejected');
};

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addMatcher(isPending, (state, action) => {
        return {
          ...initialState,
          status: "loading"
        };
      })
      .addMatcher(isFulfilled, (state, action) => {
        return {
          ...state,
          status: "success",
        };
      })
      .addMatcher(isRejected, (state, action) => {
        return {
          ...state,
          status: "failed",
        };
      });
  }
});

export default rootSlice.reducer;