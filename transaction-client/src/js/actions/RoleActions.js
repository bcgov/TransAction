import api from '../api/api';

import { FETCH_ROLES, FETCH_CURRENT_ROLE } from './types';

export const fetchRoles = () => async (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Object.keys(getState().roles).length === 0) {
        const response = await api.get(`/roles`);
        const resultToLower = response.data.map(role => {
          return { ...role, name: role.name.toLowerCase() };
        });

        dispatch({ type: FETCH_ROLES, payload: resultToLower });
      }

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchRole = id => async dispatch => {
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
