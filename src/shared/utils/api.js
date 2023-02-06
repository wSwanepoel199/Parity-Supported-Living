import axios from 'axios';
// import store from '../redux/store';
// import { removeUser } from '../redux/user/userSlice';
import { fetchStoredTokenLocal, fetchStoredTokenSession } from './authToken';
// import { redirect } from 'react-router-dom';

const DEBUG = process.env.NODE_ENV === "development";

const defaults = {
  url: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  error: {
    status: 500,
    statusText: '	InternalServerError',
    data: { message: 'Something went wrong. Please check your internet connection or contact support at willem@paritysl.com.', data: {} },
  }
};

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, headers, method, data, params }) => {
      if (DEBUG) console.log(url, headers, method, data, params);
      try {
        const res = await axios({
          url: baseUrl + url,
          method,
          headers: headers || defaults.headers,
          withCredentials: true,
          data,
          params,
        });
        return { data: res.data };
      }
      catch (axiosError) {
        let err = axiosError;
        console.error(err);
        return {
          error: {
            status: err.response?.status || defaults.error.status,
            statusText: err.response?.statusText || defaults.error.statusText,
            data: err.response?.data || defaults.error.data,
          },
        };
      }
    };

axios.interceptors.request.use((config) => {
  if (DEBUG) console.log("req ✉️ ", config);
  // console.log(store);
  config.headers.Authorization = `Bearer ${fetchStoredTokenLocal() || fetchStoredTokenSession()}`;
  return config;
}, (err) => {
  if (DEBUG) console.log("req ✉️ error ", err);
  return Promise.reject(err);
});

// axios.interceptors.response.use((config) => {
//   if (DEBUG) console.log("res ✉️ ", config);
//   return config;
// }, (err) => {
//   console.log("res ", err);
//   const trigger = err.response?.data?.message.trigger;

//   if (trigger === "auth") {
//     return refreshToken(store);
//   }
//   return Promise.reject(err);
// });

export async function sendMessage(message) {
  return await new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (e) => {
      if (e.data.error) {
        reject(e.data.error);
      } else {
        resolve(e.data);
      }
    };

    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage(message, [messageChannel.port2]);
    });
    // navigator.serviceWorker.active.postMessage(message, [messageChannel.port2]);
  });
}

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