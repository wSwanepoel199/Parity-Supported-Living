import axios from 'axios';
import store from '../redux/store';
// import { redirect } from 'react-router-dom';

const DEBUG = process.env.NODE_ENV === "development";

const defaults = {
  url: process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "http://192.168.1.117:5000",
  headers: {
    'Content-Type': 'application/json',
  },
  error: {
    status: 503,
    message: { msg: 'Something went wrong. Please check your internet connection or contact our support.', data: {} },
  }
};

export const axiosBaseQuery =
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

axios.interceptors.request.use((config) => {
  if (DEBUG) console.log("✉️ ", config);
  console.log(store.getState());
  config.headers.Authorization = `Bearer ${store.getState().user.authToken}`;
  return config;
}, (err) => {
  return Promise.reject(err);
});

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