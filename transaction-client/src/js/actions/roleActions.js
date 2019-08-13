import { api } from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import { FETCH_ROLES, FETCH_CURRENT_ROLE, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchRoles = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    // try {
    //   if (Object.keys(getState().roles).length === 0) {
    //     const response = await api.get(`/roles`);
    //     const data = getApiReponseData(response);

    //     const resultToLower = data.map(role => {
    //       return { ...role, name: role.name.toLowerCase() };
    //     });

    //     dispatch({ type: FETCH_ROLES, payload: resultToLower });
    //   }

    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    if (Object.keys(getState().roles).length === 0) {
      api
        .get(`/roles`)
        .then(response => {
          const data = getApiReponseData(response);

          const resultToLower = data.map(role => {
            return { ...role, name: role.name.toLowerCase() };
          });

          dispatch({ type: FETCH_ROLES, payload: resultToLower });

          resolve();
        })
        .catch(e => {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        });
    } else {
      resolve();
    }
  });
};

export const fetchRole = id => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get(`/roles/${id}`);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_CURRENT_ROLE, payload: data });

    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/roles/${id}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_CURRENT_ROLE, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};
