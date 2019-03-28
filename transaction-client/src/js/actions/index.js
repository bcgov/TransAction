import tempDb from '../api/tempDb';
import { FETCH_EVENTS } from './types';

export const fetchEvents = () => async dispatch => {
  const response = await tempDb.get('/events');

  dispatch({ type: FETCH_EVENTS, payload: response.data });
};

export const createEvent = formValues => async dispatch => {
  tempDb.post('/events', formValues);
};
