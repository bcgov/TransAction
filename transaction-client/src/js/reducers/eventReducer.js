import _ from 'lodash';
import { CREATE_EVENT, FETCH_EVENTS, FETCH_EVENT, EDIT_EVENT } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_EVENT:
      return { ...state, [action.payload.id]: action.payload };
    case CREATE_EVENT:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_EVENT:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
