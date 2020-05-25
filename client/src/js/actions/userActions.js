import * as api from '../api/api';
import { getApiReponseData, getApiPagedReponseData, buildApiErrorObject, buildApiQueryString } from '../utils';
import * as Constants from '../Constants';

import {
  FETCH_USER,
  FETCH_USERS,
  FETCH_ADMIN_USERS,
  FETCH_CURRENT_USER,
  UPDATE_AUTH_USER,
  SET_CURRENT_USER_ROLE,
  SHOW_ERROR_DIALOG_MODAL,
} from './types';

//User Actions
export const fetchCurrentUser = () => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/users/me`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_USER, payload: data });
        dispatch({ type: FETCH_CURRENT_USER, payload: data });
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

export const fetchUsers = (name, page, pageSize) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/users/?${buildApiQueryString(name, page, pageSize)}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_USERS, payload: data });
        resolve(getApiPagedReponseData(response).pageCount);
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchAdminUsers = () => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get('/admin/users', { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_ADMIN_USERS, payload: data });
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

export const fetchUser = id => dispatch => {
  return new Promise((resolve, reject) => {
    if (id) {
      api.instance
        .get(`/users/${id}`, { cancelToken: api.cancelTokenSource.token })
        .then(response => {
          const data = getApiReponseData(response);
          dispatch({ type: FETCH_USER, payload: data });
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

export const editUser = (id, userObj) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .put(`/users/${id}`, userObj, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_USER, payload: data });
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

export const editUserRole = (userId, roleId) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .put(`/admin/users/${userId}/role`, { roleId }, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_USER, payload: data });
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

export const updateAuthUser = data => {
  return {
    type: UPDATE_AUTH_USER,
    payload: data,
  };
};

export const updateCurrentUserRole = roleName => {
  const isAdmin = roleName === Constants.ROLE.ADMIN;

  return {
    type: SET_CURRENT_USER_ROLE,
    payload: { roleName, isAdmin },
  };
};
