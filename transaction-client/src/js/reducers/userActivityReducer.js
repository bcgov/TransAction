import _ from 'lodash';
import { CREATE_USER_ACTIVITY, FETCH_USER_ACTIVITIES, FETCH_USER_ACTIVITY } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_ACTIVITIES:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_USER_ACTIVITY:
    case CREATE_USER_ACTIVITY:
      return { ...state, [action.payload.id]: action.payload };

    default:
      return state;
  }
};
