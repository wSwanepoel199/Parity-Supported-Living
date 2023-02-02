import { createSlice } from "@reduxjs/toolkit";
import { fetchStoredTokenLocal, removeStoredTokenLocal, removeStoredTokenSession, storeAuthTokenLocal, storeAuthTokenSession } from "../../utils/authToken";
import { backendApi } from "../api/backendApi";

const initialState = {
  status: (sessionStorage.getItem("USER_DETAILS") || localStorage.getItem("USER_DETAILS")) ? "loggedIn" : 'loggedOut',
  user: (JSON.parse(sessionStorage.getItem("USER_DETAILS")) || JSON.parse(localStorage.getItem("USER_DETAILS"))) || {},
  error: undefined,
  intervalId: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      const { user, rememberMe } = action.payload;
      const { accessToken, ...loggedinUser } = user;
      if (rememberMe) {
        storeAuthTokenLocal(user.accessToken);
        localStorage.setItem('USER_DETAILS', JSON.stringify(loggedinUser));
      } else {
        storeAuthTokenSession(user.accessToken);
        sessionStorage.setItem("USER_DETAILS", JSON.stringify(loggedinUser));
      }
      return {
        ...state,
        status: "loggedIn",
        user: loggedinUser,
      };
    },
    signOutUser: (state) => {
      return {
        ...state,
        status: 'signingOut'
      };
    },
    removeUser: (state) => {
      if (fetchStoredTokenLocal()) {
        localStorage.removeItem("USER_DETAILS");
        removeStoredTokenLocal();
      } else {
        sessionStorage.removeItem("USER_DETAILS");
        removeStoredTokenSession();
      }
      clearInterval(state.intervalId);
      return {
        status: 'loggedOut',
        user: {},
        intervalId: null
      };
    },
    saveRefreshInterval: (state, action) => {
      return {
        ...state,
        intervalId: action.payload
      };
    }
  },
});

export const { saveUser, removeUser, signOutUser, saveRefreshInterval } = userSlice.actions;

export default userSlice.reducer;

export const userApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: (loginDetails) => ({ url: '/auth/login', method: 'post', data: loginDetails }),
      async onQueryStarted(loginDetails, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          clearInterval(getState().user.intervalId);
          dispatch(saveUser({ user: data.data.user, rememberMe: loginDetails.rememberMe }));
        }
        catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "post", id: "LIST" }] : error ? console.error(error) : null
    }),
    resetPass: builder.mutation({
      query: (newPassword) => ({ url: '/auth/new', method: 'patch', data: { password: newPassword.password, userId: newPassword.userId } }),
      async onQueryStarted(newPassword, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "user", id: "LIST" }] : error ? console.error(error) : null
    }),
    refreshUser: builder.mutation({
      query: (refresh) => ({ url: '/refresh', method: 'get' }),
      async onQueryStarted(refresh, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // clearInterval(getState().user.intervalId);
          if (fetchStoredTokenLocal()) {
            dispatch(saveUser({ user: data.data.user, rememberMe: true }));
          } else {
            dispatch(saveUser({ user: data.data.user, rememberMe: false }));
          }
          // window.location.reload();
        }
        catch (err) {
          console.error(err);
          if (err.error.status === 403) {
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
        result ? [{ type: "user", id: "LIST" }] : error ? console.error(error) : null
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({ url: '/auth/update', method: 'put', data: updatedUser }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "user", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useLoginUserMutation, useResetPassMutation, useRefreshUserMutation, useLogoutUserMutation, useCreateUserMutation, useUpdateUserMutation } = userApiSlice;