import api from '../api/api';
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
export const fetchCurrentUser = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/me`);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_USER, payload: data });
      dispatch({ type: FETCH_CURRENT_USER, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchUsers = (name, page, pageSize) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/?${buildApiQueryString(name, page, pageSize)}`);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_USERS, payload: data });
      resolve(getApiPagedReponseData(response).pageCount);
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchAdminUsers = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/admin/users');
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_ADMIN_USERS, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchUser = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const response = await api.get(`/users/${id}`);
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_USER, payload: data });
      }

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const editUser = (id, userObj) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/users/${id}`, userObj);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_USER, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const editUserRole = userObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/admin/users/role`, userObj);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_USER, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
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
