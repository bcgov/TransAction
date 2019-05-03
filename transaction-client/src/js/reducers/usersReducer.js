import { FETCH_USERS, FETCH_USER } from '../actions/types';
import _ from 'lodash';
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_USER:
      return { ...state, [action.payload.id]: action.payload };

    default:
      return state;
  }
};
