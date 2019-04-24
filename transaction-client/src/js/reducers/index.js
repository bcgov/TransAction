import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';
import authUserReducer from './authUserReducer';
import userReducer from './userReducer';
import teamReducer from './teamReducer';
import regionsReducer from './regionsReducer';
import usersReducer from './usersReducer';
import activityReducer from './activityReducer';
import userScoreReducer from './userScoreReducer';
import teamScoreReducer from './teamScoreReducer';
import allTeamScoresReducer from './allTeamScoresReducer';
import allUserScoresReducer from './allUserScoresReducer';
import rolesReducer from './rolesReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
  authUser: authUserReducer,
  user: userReducer,
  team: teamReducer,
  regions: regionsReducer,
  users: usersReducer,
  activities: activityReducer,
  userScore: userScoreReducer,
  teamScore: teamScoreReducer,
  allUserScores: allUserScoresReducer,
  allTeamScores: allTeamScoresReducer,
  roles: rolesReducer,
});
