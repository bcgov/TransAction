import { FETCH_CURRENT_TEAM } from '../actions/types';
//rename to currentUserReducer
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_CURRENT_TEAM:
      console.log('current team payload: ', action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
