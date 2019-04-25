import { FETCH_USER, EDIT_USER_DESCRIPTION } from '../actions/types';
//rename to currentUserReducer
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, ...action.payload };
    case EDIT_USER_DESCRIPTION:
      return { ...state, [action.payload.id]: action.payload };

    default:
      return state;
  }
};
