import _ from 'lodash';
import { FETCH_USER_SCORES, FETCH_TEAM_SCORES } from '../actions/types';

const DEFAULT_STATE = {
  user: {},
  team: {},
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_SCORES:
      return { ...state, user: { ...state.user, [action.payload.userId]: _.mapKeys(action.payload.data, 'eventId') } };
    case FETCH_TEAM_SCORES:
      return { ...state, team: { ...state.team, [action.payload.teamId]: _.mapKeys(action.payload.data, 'eventId') } };
    default:
      return state;
  }
};
