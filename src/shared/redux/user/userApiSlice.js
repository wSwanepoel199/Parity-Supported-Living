import { fetchStoredTokenLocal } from "../../utils/authToken";
import { clearUsers } from "../admin/adminSlice";
import { backendApi } from "../api/backendApi";
import { clearClientState } from "../client/clientSlice";
import { clearPostState } from "../posts/postSlice";
import { removeUser, saveUser, signOutUser } from "./userSlice";

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
      }
    }),
    resetPass: builder.mutation({
      query: (newPassword) => ({ url: '/auth/new', method: 'patch', data: { password: newPassword.password, userId: newPassword.userId } }),
      async onQueryStarted(newPassword, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (fetchStoredTokenLocal()) {
            dispatch(saveUser({ user: data.data.user, rememberMe: true }));
          } else {
            dispatch(saveUser({ user: data.data.user, rememberMe: false }));
          }
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
            if (getState().posts.posts) await dispatch(clearPostState());
            if (getState().admin.users) await dispatch(clearUsers());
            if (getState().clients.clients) await dispatch(clearClientState());
            dispatch(removeUser());
          }
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "post", id: "LIST" }, { type: "client", id: "LIST" }] : error ? console.error(error) : null
    }),
    logoutUser: builder.mutation({
      query: (signout) => ({ url: '/auth/logout', method: 'post', data: { userId: signout } }),
      async onQueryStarted(signout, { dispatch, getState, queryFulfilled }) {
        try {
          dispatch(signOutUser());
          if (getState().posts.posts) await dispatch(clearPostState());
          if (getState().clients.clients) await dispatch(clearClientState());
          if (getState().admin.users) await dispatch(clearUsers());
          dispatch(removeUser());
          await queryFulfilled;
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    createUser: builder.mutation({
      query: (newUser) => ({ url: '/auth/register', method: 'post', data: newUser }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "user", id: "LIST" }, { type: "client", id: "LIST" }] : error ? console.error(error) : null
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({ url: '/auth/update', method: 'put', data: updatedUser }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "user", id: "LIST" }, { type: "client", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useLoginUserMutation, useResetPassMutation, useRefreshUserMutation, useLogoutUserMutation, useCreateUserMutation, useUpdateUserMutation } = userApiSlice;