import * as api from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_ROLES, FETCH_CURRENT_ROLE, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchRoles = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if (Object.keys(getState().roles).length === 0) {
      api.instance
        .get(`/roles`, { cancelToken: api.cancelTokenSource.token })
        .then(response => {
          const data = getApiReponseData(response);

          const resultToLower = data.map(role => {
            return { ...role, name: role.name.toLowerCase() };
          });

          dispatch({ type: FETCH_ROLES, payload: resultToLower });

          resolve();
        })
        .catch(e => {
          if (!api.isCancel(e)) {
            dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
            reject(e);
          }
        });
    } else {
      resolve();
    }
  });
};

export const fetchRole = id => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/roles/${id}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_CURRENT_ROLE, payload: data });
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
