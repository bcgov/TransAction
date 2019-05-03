import { CREATE_USER_ACTIVITY } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER_ACTIVITY:
      console.log('here in the reducer, we have :', action.payload);
      return { ...state, [action.payload.id]: action.payload };

    default:
      return state;
  }
};
