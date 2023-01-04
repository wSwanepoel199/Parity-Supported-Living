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
    indexGet: builder.query({
      query: () => ({ url: '/', method: "get" }),
      providesTags: (result) => result
        ?
        [
          ...result.data.map(({ id, index }) => ({ type: 'Index', index })),
          { type: 'Index', index: 'LIST' },
        ]
        :
        [{ type: 'Index', index: 'LIST' }],

    }),
    checkToken: builder.query({
      query: () => ({ url: '/auth/checkToken', method: 'get' })
    })
  })
});

export const { useIndexGetQuery, useCheckTokenQuery } = backendApi;