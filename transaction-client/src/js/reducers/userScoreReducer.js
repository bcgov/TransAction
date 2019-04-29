import { FETCH_USER_SCORE } from '../actions/types';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_SCORE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
