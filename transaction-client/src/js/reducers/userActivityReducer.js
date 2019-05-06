import { CREATE_USER_ACTIVITY } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER_ACTIVITY:
      return { ...state, [action.payload.id]: action.payload };

    default:
      return state;
  }
};
