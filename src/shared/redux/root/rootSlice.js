import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep',
  msg: undefined
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
        status: "error",
        msg: action.payload
      };
    },
    clearMessage: (state) => {
      return {
        ...state,
        status: 'cleared',
        msg: undefined
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
          // msg: {
          //   status: action.payload.status,
          //   message: action.payload.data.message
          // }
        };
      })
      .addMatcher(isRejected, (state, action) => {
        console.log(action.payload);
        // if (action.payload.data.error.data.trigger === "refresh expired") {
        //   console.log("expired");
        // }
        const message = action.payload.data.message.message || action.payload.data.message;
        return {
          ...state,
          status: "error",
          msg: {
            status: action.payload.status,
            statusText: action.payload.statusText,
            message: message,
            data: action.payload.data.message?.trigger
          }
        };
      });
  }
});

export const { storeError, clearMessage } = rootSlice.actions;

export default rootSlice.reducer;