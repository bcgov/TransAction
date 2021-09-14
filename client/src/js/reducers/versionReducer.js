import { FETCH_VERSION } from '../actions/types';

const defaultState = {};

const versionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_VERSION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default versionReducer;
