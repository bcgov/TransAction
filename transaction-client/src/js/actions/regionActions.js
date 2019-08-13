import { api } from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_REGIONS, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchRegions = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/regions`);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_REGIONS, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};
