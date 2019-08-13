import axios from 'axios';

import { API_URL } from '../Constants';

export const api = axios.create({
  baseURL: `${API_URL}`,
  'Access-Control-Allow-Origin': '*',
});

export const CancelToken = axios.CancelToken;
export const isCancel = axios.isCancel;
