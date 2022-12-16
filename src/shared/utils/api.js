import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
// import { redirect } from 'react-router-dom';

const { fetchStoredToken, removeStoredToken } = require("./authToken");

const defaults = {
  url: process.env.REACT_APP_API_URL || "http://192.168.1.117:5000",
  headers: {
    'Content-Type': 'application/json',
    Authorization: fetchStoredToken() ? `Bearer ${fetchStoredToken()}` : undefined
  },
  error: {
    status: 503,
    message: { msg: 'Something went wrong. Please check your internet connection or contact our support.', data: {} },
  }
};

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, data, params }) => {
      try {
        const res = await axios({
          url: baseUrl + url,
          method,
          headers: defaults.headers,
          withCredentials: true,
          data,
          params,
        });
        return { data: res.data };
      } catch (axiosError) {
        let err = axiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

// TODO: keep looking into https://redux-toolkit.js.org/rtk-query/overview
export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'http://192.168.56.101:5000',
  }),
  tagTypes: ['Post', 'User', 'Index'],
  endpoints: (builder) => ({
    indexGet: builder.query({
      query: () => ({ url: '/', method: "get" }),
      providesTags: (result) => result
        ?
        [
          ...result.data.map(({ id }) => ({ type: 'Index', id })),
          { type: 'Index', id: 'LIST' },
        ]
        :
        [{ type: 'Index', id: 'LIST' }],

    }),
    loginUser: builder.mutation({
      query: (details) => ({ url: '/auth/login', method: 'post', data: details })
    }),
  })
});

export const { useIndexGetQuery, useLoginUserMutation } = backendApi;

// export default api;

// const api = (method, path, variables) =>
//   new Promise((resolve, reject) => {
//     axios({
//       url: `${defaults.url}${path}`,
//       method,
//       headers: defaults.headers,
//       withCredentials: true,
//       params: (method !== 'get' && variables.params) ? variables.params : undefined,
//       data: (method !== 'get' && variables.data) ? variables.data : undefined,
//     }).then(
//       res => {
//         resolve(res.data);
//       },
//       error => {
//         if (error.response) {
//           if (error.response.status === 401) {
//             removeStoredToken();
//             // redirect('/authenticate');
//             reject(error.response.data);
//           } else {
//             reject(error.response.data);
//           }
//         } else {
//           reject(defaults.error);
//         }
//       });
//   });
// 
// export default api;