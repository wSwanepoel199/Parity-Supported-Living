import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep',
  error: undefined
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
    storeError: (state, action) => {
      return {
        ...state,
        error: action.payload
      };
    },
    clearError: (state) => {
      return {
        ...state,
        status: 'cleared',
        error: undefined
      };
    }
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
          status: "error",
          error: action.payload
        };
      });
  }
});

export const { storeError, clearError } = rootSlice.actions;

export default rootSlice.reducer;