import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { axiosBaseQuery } from "../../utils/api";

// TODO: keep looking into https://redux-toolkit.js.org/rtk-query/overview

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "http://192.168.56.101:5000",
  }),
  tagTypes: ['Post', 'User', 'Index'],
  endpoints: (builder) => ({
    checkToken: builder.query({
      query: () => ({ url: '/auth/checkToken', method: 'get' })
    }),
    uploadUsers: builder.mutation({
      query: (upload) => ({
        url: '/files/upload',
        method: 'post',
        headers: {
          'Content-Type': upload.file.type,
          'content-length': `${upload.file.size}`,
        },
        data: upload.file,
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
        result ? [{ type: "User", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useCheckTokenQuery, useUploadUsersMutation } = backendApi;