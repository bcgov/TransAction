import { FETCH_JOIN_REQUESTS } from '../actions/types';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_JOIN_REQUESTS:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
