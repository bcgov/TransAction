import _ from 'lodash';
import { FETCH_ACTIVITY_LIST } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST:
      return { ...state, ..._.mapKeys(action.payload, 'id') };

    default:
      return state;
  }
};
