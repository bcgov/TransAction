import { UPDATE_AUTH_USER } from '../actions/types';

const DEFAULT_USER = {
  given_name: null,
  family_name: null,
  name: null,
  email: null,
  idir_displayName: null,
  idir_guid: null,
  preferred_username: null,
};

const authUserReducer = (state = DEFAULT_USER, action) => {
  switch (action.type) {
    case UPDATE_AUTH_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default authUserReducer;
