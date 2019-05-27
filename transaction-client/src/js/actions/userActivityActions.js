import api from '../api/api';

import {
  FETCH_ACTIVITY_LIST,
  CREATE_USER_ACTIVITY,
  FETCH_USER_SCORES,
  FETCH_TEAM_SCORES,
  FETCH_USER_EVENT_SCORE,
  FETCH_TEAM_EVENT_SCORE,
  FETCH_TEAM_STANDINGS,
  FETCH_REGION_STANDINGS,
} from './types';

//Activity Actions

export const fetchActivityList = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/activities');
      dispatch({ type: FETCH_ACTIVITY_LIST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const createUserActivity = activityObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // create new activity, should contain minutes, activity type, team id , user id, event id
      const response = await api.post(`/useractivity`, activityObj);

      dispatch({ type: CREATE_USER_ACTIVITY, payload: response.data });
      dispatch(fetchUserEventScore(activityObj.userId, activityObj.eventId));
      dispatch(fetchTeamEventScore(activityObj.teamId, activityObj.eventId));

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//Score Actions

export const fetchUserEventScore = (userId, eventId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // this fetches a specific user score for a specific event
      const response = await api.get(`/useractivity/user/${userId}/event/${eventId}`);
      dispatch({ type: FETCH_USER_EVENT_SCORE, payload: { userId, eventId, data: response.data } });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchUserEventScore');
      reject(e);
    }
  });
};

export const fetchAllUserScores = userId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // this fetches a specific user scores for ALL active events
      const response = await api.get(`/useractivity/user/${userId}`);

      dispatch({ type: FETCH_USER_SCORES, payload: { userId, data: response.data } });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchAllUserScores');
      reject(e);
    }
  });
};

export const fetchTeamEventScore = (teamId, eventId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // specific team specific event
      const response = await api.get(`/useractivity/team/${teamId}/event/${eventId}`);
      dispatch({ type: FETCH_TEAM_EVENT_SCORE, payload: { teamId, eventId, data: response.data } });
      resolve();
    } catch (e) {
      console.log('Error in fetchTeamEventScore' + e);
      reject(e);
    }
  });
};

export const fetchAllTeamScores = teamId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // specific team all ACTIVE events
      const response = await api.get(`/useractivity/team/${teamId}`);

      dispatch({ type: FETCH_TEAM_SCORES, payload: { teamId, data: response.data } });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchTeamStandings = (eventId, teamCount = 20) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/useractivity/event/${eventId}/top/${teamCount}`);

      dispatch({ type: FETCH_TEAM_STANDINGS, payload: { eventId, data: response.data } });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchRegionStandings = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/useractivity/event/${eventId}/region`);

      dispatch({ type: FETCH_REGION_STANDINGS, payload: { eventId, data: response.data } });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
