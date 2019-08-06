import api from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
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
  SHOW_ERROR_DIALOG_MODAL,
} from './types';
import history from '../history';
import * as Constants from '../Constants';

export const fetchCurrentTeam = () => async (dispatch, getStore) => {
  return new Promise(async (resolve, reject) => {
    try {
      const teamId = getStore().users.current.teamId;
      if (teamId) {
        const response = await api.get(`/teams/${teamId}`);
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_TEAM, payload: data });
        dispatch({ type: FETCH_CURRENT_TEAM, payload: data });
      }

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchTeam = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teams/${id}`);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_TEAM, payload: data });

      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const editTeam = (id, teamObj) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };

      const response = await api.put(`/teams/${id}`, teamObj);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_TEAM, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const createTeam = teamObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };

      const response = await api.post('/teams', teamObj);
      const data = getApiReponseData(response);

      dispatch({ type: CREATE_TEAM, payload: data });

      history.push(`${Constants.PATHS.TEAM}/${data.id}`);
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchTeams = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/teams');
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_TEAMS, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
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
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_JOIN_REQUESTS, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const fetchSpecificTeamRequests = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teamrequests/team/${id}`);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_SPECIFIC_TEAM_REQUESTS, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const createJoinRequest = reqObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teamrequests`, reqObj);
      const data = getApiReponseData(response);
      dispatch({ type: POST_REQUEST, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const editJoinRequest = (id, reqObj) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/teamrequests/${id}`, reqObj);
      const data = getApiReponseData(response);
      dispatch({ type: EDIT_JOIN_REQUEST, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const addUserToTeam = reqObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/join`, reqObj);
      const data = getApiReponseData(response);

      dispatch({ type: FETCH_TEAM, payload: data });
      dispatch({ type: DELETE_JOIN_REQUEST, payload: reqObj.id });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
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
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const joinTeam = joinObj => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/join`, joinObj);
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_TEAM, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};

export const leaveTeam = (teamId, userId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/teams/remove`, { teamId, userId });
      const data = getApiReponseData(response);
      dispatch({ type: FETCH_TEAM, payload: data });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
      reject(e);
    }
  });
};
