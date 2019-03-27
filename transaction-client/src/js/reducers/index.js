import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';

export default combineReducers({
  eventData: eventReducer,
  form: formReducer,
});
