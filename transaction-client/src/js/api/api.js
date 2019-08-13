import axios from 'axios';

import { API_URL } from '../Constants';

export const api = axios.create({
  baseURL: `${API_URL}`,
  'Access-Control-Allow-Origin': '*',
});

export let cancelTokenSource = axios.CancelToken.source();

export const resetCancelTokenSource = () => {
  cancelTokenSource = axios.CancelToken.source();
};

export const isCancel = axios.isCancel;

export const cancelRequest = () => {
  cancelTokenSource.cancel();
};
