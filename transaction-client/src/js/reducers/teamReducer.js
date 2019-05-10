import { FETCH_TEAM, CREATE_TEAM, FETCH_TEAMS } from '../actions/types';
import _ from 'lodash';

const defaultState = {
  current: {},
  all: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_TEAMS:
      return { ...state, all: { ..._.mapKeys(action.payload, 'id') } };
    case FETCH_TEAM:
      return { ...state, all: { ...state.all, [action.payload.id]: action.payload } };
    // case FETCH_CURRENT_TEAM:
    //   return { ...state, current: { ...state.current, ...action.payload } };
    case CREATE_TEAM:
      return { ...state, all: { ...state.all, [action.payload.id]: action.payload } };
    default:
      return state;
  }
};
