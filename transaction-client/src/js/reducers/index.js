import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
});
