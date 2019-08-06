import api from '../api/api';
import { getApiReponseData, getApiPagedReponseData, buildApiErrorObject, buildApiQueryString } from '../utils';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT, ARCHIVE_EVENT, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchEvents = (name, page, pageSize) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/events/?${buildApiQueryString(name, page, pageSize)}`);
      const data = getApiPagedReponseData(response).data;
      dispatch({ type: FETCH_EVENTS, payload: data });

      resolve(getApiPagedReponseData(response).pageCount);
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const createEvent = formValues => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/events', formValues);
      const data = getApiReponseData(response);
      dispatch({ type: CREATE_EVENT, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const editEvent = (id, formValues) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/events/${id}`, formValues);
      const data = getApiReponseData(response);
      dispatch({ type: EDIT_EVENT, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchEvent = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/events/${id}`);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_EVENT, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const archiveEvent = event => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      event = { ...event, isActive: false };

      const response = await api.put(`/events/${event.id}`, event);
      const data = getApiReponseData(response);
      dispatch({ type: ARCHIVE_EVENT, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};
