import { api } from '../api/api';
import { getApiReponseData, getApiPagedReponseData, buildApiErrorObject, buildApiQueryString } from '../utils';
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

export const fetchCurrentTeam = () => (dispatch, getStore) => {
  return new Promise((resolve, reject) => {
    const teamId = getStore().users.current.teamId;
    if (teamId) {
      api
        .get(`/teams/${teamId}`)
        .then(response => {
          const data = getApiReponseData(response);
          dispatch({ type: FETCH_TEAM, payload: data });
          dispatch({ type: FETCH_CURRENT_TEAM, payload: data });
          resolve();
        })
        .catch(e => {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        });
    } else {
      resolve();
    }
  });
};

export const fetchTeam = id => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/teams/${id}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const editTeam = (id, teamObj) => dispatch => {
  return new Promise((resolve, reject) => {
    teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };
    api
      .put(`/teams/${id}`, teamObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const createTeam = teamObj => dispatch => {
  return new Promise((resolve, reject) => {
    teamObj = { ...teamObj, name: teamObj.name.trim(), description: teamObj.description.trim() };
    api
      .post('/teams', teamObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_TEAM, payload: data });
        history.push(`${Constants.PATHS.TEAM}/${data.id}`);
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchTeams = (name, page, pageSize) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/teams/?${buildApiQueryString(name, page, pageSize)}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAMS, payload: data });
        resolve(getApiPagedReponseData(response).pageCount);
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

// Add / Remove members

//Team Requests
export const fetchJoinRequests = () => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/teamrequests`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_JOIN_REQUESTS, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchSpecificTeamRequests = id => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/teamrequests/team/${id}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_SPECIFIC_TEAM_REQUESTS, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const createJoinRequest = reqObj => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/teamrequests`, reqObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: POST_REQUEST, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const editJoinRequest = (id, reqObj) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .put(`/teamrequests/${id}`, reqObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: EDIT_JOIN_REQUEST, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const addUserToTeam = reqObj => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/teams/join`, reqObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM, payload: data });
        dispatch({ type: DELETE_JOIN_REQUEST, payload: reqObj.id });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const rejectJoinRequest = reqObj => dispatch => {
  return new Promise((resolve, reject) => {
    reqObj = { ...reqObj, isActive: false };
    api
      .put(`/teamrequests/${reqObj.id}`, reqObj)
      .then(() => {
        dispatch({ type: DELETE_JOIN_REQUEST, payload: reqObj.id });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const joinTeam = joinObj => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/teams/join`, joinObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const leaveTeam = (teamId, userId) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/teams/remove`, { teamId, userId })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};
