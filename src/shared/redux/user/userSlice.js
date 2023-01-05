import { createSlice } from "@reduxjs/toolkit";
import { fetchStoredTokenSession, removeStoredTokenLocal, removeStoredTokenSession, storeAuthTokenLocal, storeAuthTokenSession } from "../../utils/authToken";
import { backendApi } from "../api/backendApi";

const initialState = {
  user: {},
  authToken: fetchStoredTokenSession() || undefined,
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
        status: 'loggedOut'
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
          if (loginDetails.rememberMe) dispatch(saveToken(data.data.accessToken));
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
          dispatch(saveUser(data.data));
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
          dispatch(signOutUser);
          const { data } = await queryFulfilled;
          dispatch(removeUser(data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    createUser: builder.mutation({
      query: (newUser) => ({ url: '/auth/register', method: 'post', data: newUser }),
      invalidatesTags: [{ type: 'User', id: "LIST" }]
    })
  })
});

export const { useLoginUserMutation, useRefreshUserMutation, useLogoutUserMutation, useCreateUserMutation } = userApiSlice;