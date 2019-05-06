import { FETCH_ALL_USER_SCORES } from '../actions/types';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALL_USER_SCORES:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
