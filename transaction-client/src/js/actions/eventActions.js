import api from '../api/api';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT, ARCHIVE_EVENT } from './types';

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
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/events', formValues);
      dispatch({ type: CREATE_EVENT, payload: response.data });

      resolve();
    } catch (e) {
      console.log('Error in createEvent');
      reject(e);
    }
  });
};

export const editEvent = (id, formValues) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/events/${id}`, formValues);
      dispatch({ type: EDIT_EVENT, payload: response.data });

      resolve();
    } catch (e) {
      console.log('Error in editEvent');
      reject(e);
    }
  });
};

export const fetchEvent = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/events/${id}`);
      dispatch({ type: FETCH_EVENT, payload: response.data });

      resolve();
    } catch (e) {
      console.log('Error in fetchEvent');
      reject(e);
    }
  });
};

export const archiveEvent = event => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      event = { ...event, isActive: false };

      const response = await api.put(`/events/${event.id}`, event);
      dispatch({ type: ARCHIVE_EVENT, payload: response.data });

      resolve();
    } catch (e) {
      console.log('Error in archiveEvent');
      reject(e);
    }
  });
};
