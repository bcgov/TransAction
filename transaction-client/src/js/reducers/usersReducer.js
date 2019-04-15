import { FETCH_USERS } from '../actions/types';
import _ from 'lodash';
//rename to currentUserReducer
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    default:
      return state;
  }
};
