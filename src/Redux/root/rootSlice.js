import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'uninitiated',
  msg: undefined
};

const isPending = (action) => {
  // console.log(action);
  // console.log(action.meta?.arg.endpointName);
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
        console.log("Request Args: ", action.meta?.arg);
        if (action.meta?.arg.endpointName === "refreshUser") {
          return {
            ...initialState
          };
        } else {
          return {
            ...initialState,
            status: "loading"
          };
        }
      })
      .addMatcher(isFulfilled, (state, action) => {
        // if (["getPosts", "getAllClients", "getAllUsers"].includes(action.meta?.arg.endpointName)) {
        //   return {
        //     ...state,
        //     status: state.status === "error" ? state.state : "success"
        //   };
        // }
        return {
          ...state,
          status: state.status === "loading" ? "success" : state.status,
          // msg: {
          //   status: action.payload.status,
          //   message: action.payload.data.message
          // }
        };
      })
      .addMatcher(isRejected, (state, action) => {
        // console.log('rejected', action?.payload);
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

export const selectRoot = state => state.root;