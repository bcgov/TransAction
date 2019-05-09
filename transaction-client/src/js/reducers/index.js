import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';
import authUserReducer from './authUserReducer';
import teamsReducer from './teamReducer';
import regionsReducer from './regionsReducer';
import usersReducer from './usersReducer';
import activityReducer from './activityReducer';
import rolesReducer from './rolesReducer';
import joinRequestsReducer from './joinRequestsReducer';
import userActivityReducer from './userActivityReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
  authUser: authUserReducer,
  teams: teamsReducer,
  regions: regionsReducer,
  users: usersReducer,
  activities: activityReducer,
  userActivities: userActivityReducer,
  roles: rolesReducer,
  joinRequests: joinRequestsReducer,
});
