import api from '../api/api';

import {
  FETCH_TEAM,
  CREATE_TEAM,
  FETCH_TEAMS,
  FETCH_CURRENT_TEAM,
  POST_REQUEST,
  FETCH_SPECIFIC_TEAM_REQUESTS,
  FETCH_JOIN_REQUESTS,
  EDIT_JOIN_REQUEST,
} from './types';
import history from '../history';

export const fetchCurrentTeam = () => async (dispatch, getStore) => {
  return new Promise(async (resolve, reject) => {
    try {
      const teamId = getStore().users.current.teamId;
      if (teamId) {
        const response = await api.get(`/teams/${teamId}`);

        dispatch({ type: FETCH_TEAM, payload: response.data });
        dispatch({ type: FETCH_CURRENT_TEAM, payload: response.data });
      }

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchTeam = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const response = await api.get(`/teams/${id}`);

        dispatch({ type: FETCH_TEAM, payload: response.data });
      }

      resolve();
    } catch (e) {
      console.log('ERROR in fetchTeam');
      reject(e);
    }
  });
};

export const editTeam = (teamObj, id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/teams/${id}`, teamObj);

      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in editeam');
      reject(e);
    }
  });
};

export const createTeam = formValues => async dispatch => {
  const response = await api.post('/teams', formValues);

  dispatch({ type: CREATE_TEAM, payload: response.data });
  dispatch({ type: FETCH_CURRENT_TEAM, payload: response.data });

  history.push('/team');
};

export const fetchTeams = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/teams');
      dispatch({ type: FETCH_TEAMS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//Team Requests
export const fetchJoinRequests = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teamrequests`);
      dispatch({ type: FETCH_JOIN_REQUESTS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchSpecificTeamRequests = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teamrequests/team/${id}`);
      dispatch({ type: FETCH_SPECIFIC_TEAM_REQUESTS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const postJoinRequest = reqObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teamrequests`, reqObj);
      dispatch({ type: POST_REQUEST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const editJoinRequest = (reqObj, id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/teamrequests/${id}`, reqObj);
      dispatch({ type: EDIT_JOIN_REQUEST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
