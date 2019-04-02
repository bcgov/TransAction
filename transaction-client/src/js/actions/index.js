import tempDb from '../api/tempDb';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT } from './types';
//import history from '../history';

export const fetchEvents = () => async dispatch => {
  const response = await tempDb.get('/events');

  dispatch({ type: FETCH_EVENTS, payload: response.data });
};

export const createEvent = formValues => async dispatch => {
  const response = await tempDb.post('/events', formValues);

  dispatch({ type: CREATE_EVENT, payload: response.data });
};

export const editEvent = (id, formValues) => async dispatch => {
  const response = await tempDb.put(`/events/${id}`, formValues);

  dispatch({ type: EDIT_EVENT, payload: response.data });
};

export const fetchEvent = id => async dispatch => {
  const response = await tempDb.get(`/events/${id}`);

  dispatch({ type: FETCH_EVENT, payload: response.data });
};
