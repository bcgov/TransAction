import { FETCH_CURRENT_ROLE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_CURRENT_ROLE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
