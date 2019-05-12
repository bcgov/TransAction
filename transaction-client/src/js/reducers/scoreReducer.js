import _ from 'lodash';
import { FETCH_USER_SCORES, FETCH_TEAM_SCORES, FETCH_USER_EVENT_SCORE, FETCH_TEAM_EVENT_SCORE } from '../actions/types';

const DEFAULT_STATE = {
  user: {},
  team: {},
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_SCORES:
      return { ...state, user: { ...state.user, [action.payload.userId]: _.mapKeys(action.payload.data, 'eventId') } };
    case FETCH_USER_EVENT_SCORE:
      return {
        ...state,
        user: {
          ...state.user,
          ...{
            ...state.user[action.payload.userId],
            [action.payload.userId]: {
              ...state.user[action.payload.userId],
              [action.payload.eventId]: action.payload.data,
            },
          },
        },
      };
    case FETCH_TEAM_SCORES:
      return { ...state, team: { ...state.team, [action.payload.teamId]: _.mapKeys(action.payload.data, 'eventId') } };
    case FETCH_TEAM_EVENT_SCORE:
      return {
        ...state,
        team: {
          ...state.team,
          ...{
            ...state.team[action.payload.teamId],
            [action.payload.teamId]: {
              ...state.team[action.payload.teamId],
              [action.payload.eventId]: action.payload.data,
            },
          },
        },
      };
    default:
      return state;
  }
};
