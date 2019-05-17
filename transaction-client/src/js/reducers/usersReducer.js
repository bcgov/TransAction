import _ from 'lodash';

import { FETCH_USERS, FETCH_USER, FETCH_CURRENT_USER, SET_CURRENT_USER_ROLE } from '../actions/types';

const defaultState = {
  current: {},
  all: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, all: { ..._.mapKeys(action.payload, 'id') } };
    case FETCH_USER:
      return { ...state, all: { ...state.all, [action.payload.id]: action.payload } };
    case FETCH_CURRENT_USER:
      return { ...state, current: { ...state.current, ...action.payload } };
    case SET_CURRENT_USER_ROLE:
      return { ...state, current: { ...state.current, ...action.payload } };
    default:
      return state;
  }
};
