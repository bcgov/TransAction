import axios from 'axios';

const apiUrl = window.RUNTIME_REACT_APP_API_HOST
  ? `${window.location.protocol}//${window.RUNTIME_REACT_APP_API_HOST}/api`
  : process.env.REACT_APP_API_HOST;

const api = axios.create({
  baseURL: `${apiUrl}`,
  'Access-Control-Allow-Origin': '*',
});

export default api;
