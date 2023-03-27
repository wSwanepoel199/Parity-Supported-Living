import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { axiosBaseQuery } from "../../Services/api";
import { fetchStoredTokenLocal } from "../../Helpers/authToken";
import { clearUsers } from "../admin/adminSlice";
import { clearClientState } from "../client/clientSlice";
import { clearPostState } from "../posts/postSlice";
import { removeUser, saveUser } from "../user/userSlice";

// TODO: keep looking into https://redux-toolkit.js.org/rtk-query/overview

// "http://localhost:5000"
// "http://192.168.56.101:5000"

const baseAxiosQuery = axiosBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL
});

async function axiosBaseQueryWithReauth(arg, api) {
  let result = await baseAxiosQuery(arg, api);
  if (result.error && result.error.data.message?.trigger === "auth") {
    const refreshResult = await baseAxiosQuery({ url: '/refresh', method: 'get' });
    if (refreshResult.data) {
      const { data } = refreshResult;
      if (fetchStoredTokenLocal()) {
        api.dispatch(saveUser({ user: data.data.user, rememberMe: true }));
      } else {
        api.dispatch(saveUser({ user: data.data.user, rememberMe: false }));
      }

      result = baseAxiosQuery(arg, api);
    } else {
      if (api.getState().posts.posts) await api.dispatch(clearPostState());
      if (api.getState().admin.users) await api.dispatch(clearUsers());
      if (api.getState().clients.clients) await api.dispatch(clearClientState());
      api.dispatch(removeUser());
    }
  }
  return result;
}

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: axiosBaseQueryWithReauth,
  tagTypes: ['post', 'user', 'client', 'Index'],
  endpoints: (builder) => ({
    checkToken: builder.query({
      query: () => ({ url: '/auth/checkToken', method: 'get' })
    }),
    uploadFile: builder.mutation({
      query: (upload) => ({
        url: '/files/upload',
        method: 'post',
        data: upload.data,
        params: { type: upload.type }
      }),
      async onQueryStarted(file, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: 'user' }, { type: 'post' }, { type: 'client' }] : error ? console.error(error) : null
    })
  })
});

export const { useCheckTokenQuery, useUploadFileMutation } = backendApi;