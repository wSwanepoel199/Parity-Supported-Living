import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../../utils/api";
import { fetchStoredToken, removeStoredToken, storeAuthToken } from "../../utils/authToken";

const initialState = {
  user: {},
  authToken: fetchStoredToken() || undefined,
  status: 'loggedOut',
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      storeAuthToken(action.payload.accessToken);
      return {
        ...state,
        user: action.payload,
        authToken: action.payload.accessToken,
        status: "loggedIn"
      };
    },
    removeUser: () => {
      removeStoredToken();
      return {
        ...initialState,
        authToken: undefined
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
});

export const { saveUser, removeUser, saveToken } = userSlice.actions;

export default userSlice.reducer;

export const userApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: (loginDetails) => ({ url: '/auth/login', method: 'post', data: loginDetails }),
      async onQueryStarted(loginDetails, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(saveUser(data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    refreshUser: builder.mutation({
      query: (refresh) => ({ url: '/refresh', method: 'get' }),
      async onQueryStarted(refresh, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(saveUser(data.data));
        }
        catch (err) {
          console.error(err);
          if (err.error.status === 401) {
            removeStoredToken();
            dispatch(removeUser());
          }
        }
      }
    }),
    logoutUser: builder.mutation({
      query: (signout) => ({ url: '/auth/logout', method: 'get' }),
      async onQueryStarted(signout, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(removeUser(data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    })
  })
});

export const { useLoginUserMutation, useRefreshUserMutation, useLogoutUserMutation } = userApiSlice;