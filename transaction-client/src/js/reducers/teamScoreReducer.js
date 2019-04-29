import { FETCH_TEAM_SCORE } from '../actions/types';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_TEAM_SCORE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
