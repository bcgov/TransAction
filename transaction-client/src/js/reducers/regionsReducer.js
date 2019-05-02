import { FETCH_REGIONS } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_REGIONS:
      return { ...state, ..._.mapKeys(action.payload) };
    default:
      return state;
  }
};
