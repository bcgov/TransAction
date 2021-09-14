import { FETCH_REGIONS } from '../actions/types';
import _ from 'lodash';

const regionsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_REGIONS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    default:
      return state;
  }
};

export default regionsReducer;
