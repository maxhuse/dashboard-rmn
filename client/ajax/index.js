/*
* Module for working with rest server: loads data, parse json, handles errors.
* */
import request from './request';

const ajax = (url, options = {}) => (
  request(url, options).then(({ status, data, error, isAborted }) => {
    if (status === 200) {
      // Apply a handler for successful ajax requests
      return {
        status,
        data,
        isSuccess: true,
      };
    }

    // Apply a handler for error ajax requests
    return {
      status,
      data,
      error,
      isAborted,
    };
  })
);

export default {
  get: (url, options) => ajax(url, { method: 'GET', ...options }),
  post: (url, options) => ajax(url, { method: 'POST', ...options }),
  patch: (url, options) => ajax(url, { method: 'PATCH', ...options }),
  put: (url, options) => ajax(url, { method: 'PUT', ...options }),
  delete: (url, options) => ajax(url, { method: 'DELETE', ...options }),
};

