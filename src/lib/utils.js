// @ts-check

import axios from 'axios';
import getAuthToken from './auth.js';

export const getFetch = () => {
  const axiosInstance = axios.create({
    headers: {
      Authorization: getAuthToken(),
    },
  });

  return axiosInstance;
};

export default { getFetch };
