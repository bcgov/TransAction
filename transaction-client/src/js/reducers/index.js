import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';
import authUserReducer from './authUserReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
  authUser: authUserReducer,
});
