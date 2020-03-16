import * as api from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_VERSION, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchVersion = () => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/version`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_VERSION, payload: data });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};
