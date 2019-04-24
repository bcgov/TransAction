import { FETCH_ROLES } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ROLES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
