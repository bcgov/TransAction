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
  DELETE_JOIN_REQUEST,
} from './types';
import history from '../history';
import * as Constants from '../Constants';

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
      const response = await api.get(`/teams/${id}`);

      dispatch({ type: FETCH_TEAM, payload: response.data });

      resolve();
    } catch (e) {
      console.log('ERROR in fetchTeam');
      reject(e);
    }
  });
};

export const editTeam = (id, teamObj) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };

      const response = await api.put(`/teams/${id}`, teamObj);

      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in editeam');
      reject(e);
    }
  });
};

export const createTeam = teamObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };

      const response = await api.post('/teams', teamObj);

      dispatch({ type: CREATE_TEAM, payload: response.data });

      history.push(`${Constants.PATHS.TEAM}/${response.data.id}`);
      resolve();
    } catch (e) {
      console.log('ERROR in createteam');
      reject(e);
    }
  });
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

// Add / Remove members

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

export const createJoinRequest = reqObj => async dispatch => {
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

export const editJoinRequest = (id, reqObj) => async dispatch => {
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

export const addUserToTeam = reqObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/join`, reqObj);

      dispatch({ type: FETCH_TEAM, payload: response.data });
      dispatch({ type: DELETE_JOIN_REQUEST, payload: reqObj.id });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const rejectJoinRequest = reqObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      reqObj = { ...reqObj, isActive: false };

      await api.put(`/teamrequests/${reqObj.id}`, reqObj);
      dispatch({ type: DELETE_JOIN_REQUEST, payload: reqObj.id });

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const joinTeam = joinObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/join`, joinObj);
      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const leaveTeam = (teamId, userId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/remove`, { teamId, userId });
      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
