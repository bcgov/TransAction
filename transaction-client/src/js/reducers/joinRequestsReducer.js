import {
  FETCH_JOIN_REQUESTS,
  FETCH_SPECIFIC_TEAM_REQUESTS,
  POST_REQUEST,
  EDIT_JOIN_REQUEST,
  DELETE_JOIN_REQUEST,
} from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_JOIN_REQUESTS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_SPECIFIC_TEAM_REQUESTS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case POST_REQUEST:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_JOIN_REQUEST:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_JOIN_REQUEST:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
