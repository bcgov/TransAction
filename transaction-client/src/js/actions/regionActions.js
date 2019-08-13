import { api } from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_REGIONS, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchRegions = () => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/regions`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_REGIONS, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};
