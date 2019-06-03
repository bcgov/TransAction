import { FETCH_TOPICS, FETCH_TOPIC } from '../actions/types';
import _ from 'lodash';

const DEFAULT_STATE = {};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_TOPICS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_TOPIC:
      return { ...state, [action.payload.id]: { ...state[action.payload.id], ...action.payload } };
    default:
      return state;
  }
};
