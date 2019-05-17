import api from '../api/api';
import * as Constants from '../Constants';

import { FETCH_USER, FETCH_USERS, FETCH_CURRENT_USER, UPDATE_AUTH_USER, SET_CURRENT_USER_ROLE } from './types';

//User Actions
export const fetchCurrentUser = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/me`);

      dispatch({ type: FETCH_USER, payload: response.data });
      dispatch({ type: FETCH_CURRENT_USER, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchUsers = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/users');

      dispatch({ type: FETCH_USERS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
export const fetchUser = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const response = await api.get(`/users/${id}`);

        dispatch({ type: FETCH_USER, payload: response.data });
      }

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//TODO Combine these two
export const editUser = (id, userObj) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/users/${id}`, userObj);

      dispatch({ type: FETCH_USER, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in edituser');
      reject(e);
    }
  });
};

export const recruitUser = (userObj, id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/users/${id}`, userObj);

      dispatch({ type: FETCH_USER, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in edituser');
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
