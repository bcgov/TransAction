import { FETCH_EVENTS } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_EVENTS:
      return action.payload;

    default:
      return state;
  }
};
