import tempDb from '../api/tempDb';

export const fetchData = () => async dispatch => {
  const response = await tempDb.get('/events');

  dispatch({ type: 'FETCH_DATA', payload: response.data });
};
