import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStoredToken, removeStoredToken, storeAuthToken } from "../../utils/authToken";
// import api from '../../utils/api';

const initialState = {
  user: {},
  authToken: fetchStoredToken() || undefined,
  status: 'loggedOut',
  error: undefined
};

// const isPending = (action) => {
//   return action.type.endsWith('pending');
// };

// const isFulfilled = (action) => {
//   return action.type.endsWith('fulfilled');
// };

// const isRejected = (action) => {
//   return action.type.endsWith('rejected');
// };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: () => {

    },
    removeUser: () => {
      removeStoredToken();
      return {
        ...initialState,
        authToken: undefined
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
  },
  // extraReducers(builder) {
  //   builder
  //     .addMatcher(isPending, () => {
  //       return {
  //         ...initialState,
  //         status: "loading"
  //       };
  //     })
  //     .addMatcher(isFulfilled, (state, action) => {
  //       storeAuthToken(action.payload.data.accessToken);
  //       return {
  //         ...state,
  //         status: "loggedIn",
  //         user: action.payload.data,
  //         authToken: action.payload.data.accessToken
  //       };
  //     })
  //     .addMatcher(isRejected, (state, action) => {
  //       return {
  //         ...state,
  //         status: "failed",
  //         error: action.error.message
  //       };
  //     });
  // }
});

// export const getUser = createAsyncThunk('user/getUser', async (details) => {
//   const res = await api("post", '/auth/login', { data: details });
//   return res;
// });

// export const refreshUser = createAsyncThunk('user/refreshUser', async () => {
//   const res = await api("get", '/refresh');
//   return res;
// });

export const { loginUser, saveUser, removeUser, saveToken } = userSlice.actions;

export default userSlice.reducer;