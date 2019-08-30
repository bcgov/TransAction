import _ from 'lodash';
import { FETCH_ACTIVITY_LIST, EDIT_ACTIVITY } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case EDIT_ACTIVITY:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
