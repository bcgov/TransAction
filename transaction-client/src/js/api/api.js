import axios from 'axios';

const apiUrl = window.RUNTIME_REACT_APP_API_HOST ? window.RUNTIME_REACT_APP_API_HOST : process.env.REACT_APP_API_HOST;

const api = axios.create({
  baseURL: `${apiUrl}`,
});

export default api;
