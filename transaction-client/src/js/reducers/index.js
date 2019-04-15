import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';
import authUserReducer from './authUserReducer';
import userReducer from './userReducer';
import teamReducer from './teamReducer';
import regionsReducer from './regionsReducer';
import usersReducer from './usersReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
  authUser: authUserReducer,
  user: userReducer,
  team: teamReducer,
  regions: regionsReducer,
  users: usersReducer,
});
