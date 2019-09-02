import _ from 'lodash';
import { FETCH_ACTIVITY_LIST, CREATE_ACTIVITY_TYPE, EDIT_ACTIVITY_TYPE, DELETE_ACTIVITY_TYPE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case CREATE_ACTIVITY_TYPE:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_ACTIVITY_TYPE:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_ACTIVITY_TYPE:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
