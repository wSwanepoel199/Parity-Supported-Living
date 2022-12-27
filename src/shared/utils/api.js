import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
// import { redirect } from 'react-router-dom';

const { fetchStoredToken } = require("./authToken");

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