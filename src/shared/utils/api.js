import axios from 'axios';
import { redirect } from 'react-router-dom';

const { getStoredAuthToken, removeStoredToken } = require("./authToken");

const defaults = {
  url: process.env.API_URL || "http://192.168.56.101:3000",
  headers: () => ({
    'Content-Type': 'application/json',
    Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined
  }),
  error: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please check your internet connection or contact our support.',
    status: 503,
    data: {},
  }
};

const api = (method, path, variables) => {
  new Promise((resolve, reject) => {
    axios({
      url: `${defaults.url}${path}`,
      method,
      headers: defaults.headers(),
      credentials: 'include',
      params: method !== 'get' ? variables : undefined,
      data: method !== 'get' ? variables : undefined,
    }).then(
      res => {
        resolve(res.data);
      },
      error => {
        if (error.response) {
          if (error.response.data.error.code === 'INVALID_TOKEN') {
            removeStoredToken();
            redirect('/authenticate');
          } else {
            reject(error.response.data.error);
          }
        } else {
          reject(defaults.error);
        }
      });
  });
};

const get = (...args) => api('get', ...args);
const post = (...args) => api('post', ...args);

export { get, post };