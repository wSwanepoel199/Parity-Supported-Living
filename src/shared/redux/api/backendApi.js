import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { axiosBaseQuery } from "../../utils/api";
import { fetchStoredTokenLocal } from "../../utils/authToken";
import { clearUsers } from "../admin/adminSlice";
import { clearPostState } from "../posts/postSlice";
import { removeUser, saveUser } from "../user/userSlice";

// TODO: keep looking into https://redux-toolkit.js.org/rtk-query/overview

const baseAxiosQuery = axiosBaseQuery({
  baseUrl: process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "http://localhost:5000",
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
        result ? [{ type: result.type, id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useCheckTokenQuery, useUploadFileMutation } = backendApi;