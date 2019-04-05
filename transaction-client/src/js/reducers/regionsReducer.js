import { FETCH_REGIONS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_REGIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
