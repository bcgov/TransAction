import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import activityReducer from './activityReducer';
import authUserReducer from './authUserReducer';
import eventReducer from './eventReducer';
import joinRequestsReducer from './joinRequestsReducer';
import messageReducer from './messageReducer';
import regionsReducer from './regionsReducer';
import rolesReducer from './rolesReducer';
import scoreReducer from './scoreReducer';
import teamsReducer from './teamReducer';
import usersReducer from './usersReducer';
import userActivityReducer from './userActivityReducer';
import errorDialogReducer from './errorDialogReducer';
import versionReducer from './versionReducer';

export default combineReducers({
  form: formReducer,
  activities: activityReducer,
  authUser: authUserReducer,
  events: eventReducer,
  joinRequests: joinRequestsReducer,
  teams: teamsReducer,
  regions: regionsReducer,
  roles: rolesReducer,
  scores: scoreReducer,
  users: usersReducer,
  userActivities: userActivityReducer,
  messages: messageReducer,
  errorDialog: errorDialogReducer,
  version: versionReducer,
});
