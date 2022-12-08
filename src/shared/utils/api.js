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

const api = (method, path, variables) =>
  new Promise((resolve, reject) => {
    axios({
      url: `${defaults.url}${path}`,
      method,
      headers: defaults.headers,
      withCredentials: true,
      params: (method !== 'get' && variables.params) ? variables.params : undefined,
      data: (method !== 'get' && variables.data) ? variables.data : undefined,
    }).then(
      res => {
        resolve(res.data);
      },
      error => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredToken();
            // redirect('/authenticate');
            reject(error.response.data);
          } else {
            reject(error.response.data);
          }
        } else {
          reject(defaults.error);
        }
      });
  });


export default api;