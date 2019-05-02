import { FETCH_SPECIFIC_TEAM_REQUESTS } from '../actions/types';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SPECIFIC_TEAM_REQUESTS:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
