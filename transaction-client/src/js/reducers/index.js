import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import eventReducer from './eventReducer';
import authUserReducer from './authUserReducer';
import currentUserReducer from './currentUserReducer';
import teamReducer from './teamReducer';
import regionsReducer from './regionsReducer';
import usersReducer from './usersReducer';
import activityReducer from './activityReducer';
import userScoreReducer from './userScoreReducer';
import teamScoreReducer from './teamScoreReducer';
import allTeamScoresReducer from './allTeamScoresReducer';
import allUserScoresReducer from './allUserScoresReducer';
import rolesReducer from './rolesReducer';
import currentTeamReducer from './currentTeamReducer';

export default combineReducers({
  form: formReducer,
  events: eventReducer,
  authUser: authUserReducer,
  currentUser: currentUserReducer,
  team: teamReducer,
  regions: regionsReducer,
  users: usersReducer,
  activities: activityReducer,
  userScore: userScoreReducer,
  teamScore: teamScoreReducer,
  allUserScores: allUserScoresReducer,
  allTeamScores: allTeamScoresReducer,
  roles: rolesReducer,
  currentTeam: currentTeamReducer,
});
