import api from '../api/api';
import { getApiReponseData } from '../utils';
import { FETCH_REGIONS } from './types';

export const fetchRegions = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/regions`);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_REGIONS, payload: data });

      resolve();
    } catch (e) {
      console.log('ERROR in fetchR');
      reject(e);
    }
  });
};
