import { FETCH_VERSION } from '../actions/types';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_VERSION:
      return { ...state, ...{ ...action.payload, environment: 'development' } };
    default:
      return state;
  }
};
