import axios from 'axios';

const apiUrl = window.RUNTIME_REACT_APP_API_HOST
  ? `${appendHostName(window.RUNTIME_REACT_APP_API_HOST)}/api`
  : process.env.REACT_APP_API_HOST;

function appendHostName(subDomain) {
  const regex = /^transaction.+(dev|test|prod)/g;
  return window.location.hostname.replace(regex, subDomain);
}

const api = axios.create({
  baseURL: `${apiUrl}`,
});

export default api;
