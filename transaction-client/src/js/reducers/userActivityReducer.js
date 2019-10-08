import _ from 'lodash';
import {
  CREATE_USER_ACTIVITY,
  FETCH_USER_ACTIVITIES,
  FETCH_USER_ACTIVITY,
  EDIT_USER_ACTIVITY,
  DELETE_USER_ACTIVITY,
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_ACTIVITIES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_USER_ACTIVITY:
    case CREATE_USER_ACTIVITY:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_USER_ACTIVITY:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_USER_ACTIVITY:
      console.log(action.payload);
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
