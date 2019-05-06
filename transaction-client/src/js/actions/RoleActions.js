import api from '../api/api';

import { FETCH_ROLES, FETCH_CURRENT_ROLE } from './types';

export const fetchRoles = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/roles`);
      const resultToLower = response.data.map(element => {
        return { ...element, name: element.name.toLowerCase() };
      });

      dispatch({ type: FETCH_ROLES, payload: resultToLower });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchRoles');
      reject(e);
    }
  });
};

export const fetchCurrentRole = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/roles/${id}`);

      dispatch({ type: FETCH_CURRENT_ROLE, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
