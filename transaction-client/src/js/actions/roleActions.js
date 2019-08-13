import { api } from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_ROLES, FETCH_CURRENT_ROLE, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchRoles = () => async (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Object.keys(getState().roles).length === 0) {
        const response = await api.get(`/roles`);
        const data = getApiReponseData(response);

        const resultToLower = data.map(role => {
          return { ...role, name: role.name.toLowerCase() };
        });

        dispatch({ type: FETCH_ROLES, payload: resultToLower });
      }

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchRole = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/roles/${id}`);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_CURRENT_ROLE, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};
