import api from '../api/api';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT } from './types';

export const fetchEvents = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/events');
      dispatch({ type: FETCH_EVENTS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
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
