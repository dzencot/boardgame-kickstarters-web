import { useContext } from 'react';
import ApiContext from './ApiContext.js';

const useApi = () => {
  const api = useContext(ApiContext);

  return api;
};

export default useApi;
