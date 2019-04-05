import { FETCH_TEAM } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_TEAM:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
