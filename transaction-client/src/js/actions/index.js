import api from '../api/api';
//import _ from 'lodash';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  FETCH_EVENT,
  EDIT_EVENT,
  FETCH_USER,
  FETCH_TEAM,
  CREATE_TEAM,
  FETCH_REGIONS,
  FETCH_USERS,
  FETCH_TEAMS,
} from './types';
import history from '../history';

//Event Actions
export const fetchEvents = toggleSpinner => async dispatch => {
  const response = await api.get('/events');
  dispatch({ type: FETCH_EVENTS, payload: response.data });
  toggleSpinner();
};

export const createEvent = formValues => async dispatch => {
  const response = await api.post('/events', formValues);

  dispatch({ type: CREATE_EVENT, payload: response.data });
};

export const editEvent = (id, formValues) => async dispatch => {
  const response = await api.put(`/events/${id}`, formValues);

  dispatch({ type: EDIT_EVENT, payload: response.data });
};

export const fetchEvent = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/events/${id}`);
      dispatch({ type: FETCH_EVENT, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//User Actions
export const fetchUser = id => async dispatch => {
  // console.log('FetchUser given id: ', id);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/${id}`);
      //console.log(response.data);
      dispatch({ type: FETCH_USER, payload: response.data });
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
      //console.log('fetchUsers: ', response.data);
      dispatch({ type: FETCH_USERS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
export const fetchTeam = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.group('FetchTeam given id: ', id);
      const response = await api.get(`/teams/${id}`);
      // console.log(response.data);
      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
//TODO Combine these two
export const editUser = (userObj, id) => async dispatch => {
  // console.log(userObj);
  const response = await api.put(`/users/${id}`, userObj);

  dispatch({ type: FETCH_USER, payload: response.data });
};
export const editTeam = (userObj, id) => async dispatch => {
  // console.log(userObj);
  const response = await api.put(`/teams/${id}`, userObj);

  dispatch({ type: FETCH_TEAM, payload: response.data });
};

export const fetchRegions = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/regions`);

      dispatch({ type: FETCH_REGIONS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const createTeam = formValues => async dispatch => {
  const response = await api.post('/teams', formValues);

  dispatch({ type: CREATE_TEAM, payload: response.data });
  history.push('/team');
};

export const fetchTeams = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/teams');
      dispatch({ type: FETCH_TEAMS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
