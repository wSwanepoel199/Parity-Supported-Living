import { createSlice } from "@reduxjs/toolkit";
import { removeStoredTokenLocal, removeStoredTokenSession, storeAuthTokenLocal, storeAuthTokenSession } from "../../utils/authToken";
import { backendApi } from "../api/backendApi";

const initialState = {
  user: {},
  authToken: undefined,
  status: 'loggedOut',
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      storeAuthTokenSession(action.payload.accessToken);
      return {
        ...state,
        user: action.payload,
        authToken: action.payload.accessToken,
        status: "loggedIn"
      };
    },
    signOutUser: (state) => {
      return {
        ...state,
        status: 'signingOut'
      };
    },
    removeUser: () => {
      removeStoredTokenLocal();
      removeStoredTokenSession();
      return {
        ...initialState,
        authToken: undefined
      };
    },
    saveToken: (state, action) => {
      storeAuthTokenLocal(action.payload);
      return {
        ...state,
        authToken: action.payload
      };
    }
  },
});

export const { saveUser, removeUser, saveToken, signOutUser } = userSlice.actions;

export default userSlice.reducer;

export const userApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: (loginDetails) => ({ url: '/auth/login', method: 'post', data: loginDetails }),
      async onQueryStarted(loginDetails, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (loginDetails.rememberMe) dispatch(saveToken(data.data.data.accessToken));
          dispatch(saveUser(data.data.data));
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
          dispatch(saveUser(data.data.data));
        }
        catch (err) {
          console.error(err);
          if (err.error.status === 401) {
            dispatch(removeUser());
          }
        }
      }
    }),
    logoutUser: builder.mutation({
      query: (signout) => ({ url: '/auth/logout', method: 'get' }),
      async onQueryStarted(signout, { dispatch, queryFulfilled }) {
        try {
          dispatch(signOutUser());
          await queryFulfilled;
          dispatch(removeUser());
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    createUser: builder.mutation({
      query: (newUser) => ({ url: '/auth/register', method: 'post', data: newUser }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "User", id: "LIST" }] : error ? console.error(error) : null
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({ url: '/auth/update', method: 'put', data: updatedUser }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "User", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useLoginUserMutation, useRefreshUserMutation, useLogoutUserMutation, useCreateUserMutation, useUpdateUserMutation } = userApiSlice;