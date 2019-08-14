import * as api from '../api/api';
import { getApiReponseData, getApiPagedReponseData, buildApiErrorObject, buildApiQueryString } from '../utils';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT, ARCHIVE_EVENT, SHOW_ERROR_DIALOG_MODAL } from './types';

export const fetchEvents = (name, page, pageSize) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/events/?${buildApiQueryString(name, page, pageSize)}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_EVENTS, payload: data });

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

export const createEvent = formValues => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .post('/events', formValues, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_EVENT, payload: data });

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

export const editEvent = (id, formValues) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .put(`/events/${id}`, formValues, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: EDIT_EVENT, payload: data });

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

export const fetchEvent = id => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/events/${id}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_EVENT, payload: data });

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

export const archiveEvent = event => dispatch => {
  return new Promise((resolve, reject) => {
    event = { ...event, isActive: false };
    api.instance
      .put(`/events/${event.id}`, event, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: ARCHIVE_EVENT, payload: data });

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
