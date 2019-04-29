import _ from 'lodash';
import { CREATE_USER_ACTIVITY, FETCH_ACTIVITY_LIST } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case CREATE_USER_ACTIVITY:
      console.log('here in the reducer, we have :', action.payload);
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
