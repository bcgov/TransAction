import api from '../api/api';

import { FETCH_REGIONS } from './types';

export const fetchRegions = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/regions`);

      dispatch({ type: FETCH_REGIONS, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchR');
      reject(e);
    }
  });
};
