import api from '../api/api';
//import _ from 'lodash';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  FETCH_EVENT,
  EDIT_EVENT,
  FETCH_USER,
  FETCH_TEAM,
  EDIT_USER_DESCRIPTION,
  FETCH_REGIONS,
} from './types';
//import history from '../history';

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
  const response = await api.get(`/events/${id}`);

  dispatch({ type: FETCH_EVENT, payload: response.data });
};

//User Actions
export const fetchUser = toggleSpinner => async dispatch => {
  const response = await api.get(`/users/1`);
  if (response.data.teamid !== null) await dispatch(fetchTeam(response.data.teamid));
  dispatch({ type: FETCH_USER, payload: response.data });
  toggleSpinner();
};
export const fetchTeam = id => async dispatch => {
  const response = await api.get(`/teams/${id}`);

  dispatch({ type: FETCH_TEAM, payload: response.data });
};

export const editUserDescription = userObj => async dispatch => {
  // console.log(userObj);
  const response = await api.put(`/users/1`, userObj);

  dispatch({ type: FETCH_USER, payload: response.data });
};

export const fetchRegions = () => async dispatch => {
  const response = await api.get(`/regions`);

  dispatch({ type: FETCH_REGIONS, payload: response.data });
};
