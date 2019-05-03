import api from '../api/api';
//import _ from 'lodash';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  FETCH_EVENT,
  EDIT_EVENT,
  FETCH_USER,
  FETCH_TEAM,
  CREATE_TEAM,
  FETCH_REGIONS,
  FETCH_USERS,
  FETCH_TEAMS,
  FETCH_ACTIVITY_LIST,
  CREATE_USER_ACTIVITY,
  FETCH_USER_SCORE,
  FETCH_TEAM_SCORE,
  FETCH_ALL_TEAM_SCORES,
  FETCH_ALL_USER_SCORES,
  FETCH_ROLES,
  FETCH_CURRENT_USER,
  FETCH_CURRENT_TEAM,
  FETCH_CURRENT_ROLE,
  FETCH_REQUEST,
  FETCH_ALL_REQUESTS,
  FETCH_SPECIFIC_TEAM_REQUESTS,
} from './types';
import history from '../history';

//Event Actions
export const fetchEvents = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/events');
      dispatch({ type: FETCH_EVENTS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const createEvent = formValues => async dispatch => {
  const response = await api.post('/events', formValues);

  dispatch({ type: CREATE_EVENT, payload: response.data });
};

export const editEvent = (id, formValues) => async dispatch => {
  console.log(' here are the values passed: ', formValues);
  const response = await api.put(`/events/${id}`, formValues);
  console.log('dispatching : ', response);
  dispatch({ type: EDIT_EVENT, payload: response.data });
};

export const fetchEvent = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/events/${id}`);
      dispatch({ type: FETCH_EVENT, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//User Actions
export const fetchCurrentUser = () => async dispatch => {
  // console.log('FetchUser given id: ', id);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/me`);
      //console.log(response.data);
      dispatch({ type: FETCH_CURRENT_USER, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchUsers = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/users');
      //console.log('fetchUsers: ', response.data);
      dispatch({ type: FETCH_USERS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
export const fetchUser = id => async dispatch => {
  // console.log('FetchUser given id: ', id);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/users/${id}`);
      //console.log(response.data);
      dispatch({ type: FETCH_USER, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchCurrentTeam = id => async dispatch => {
  // console.log('FetchUser given id: ', id);
  console.log('current team fetch');
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teams/${id}`);
      //console.log(response.data);
      dispatch({ type: FETCH_CURRENT_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchCurrentRole = id => async dispatch => {
  // console.log('FetchUser given id: ', id);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/roles/${id}`);
      //console.log(response.data);
      dispatch({ type: FETCH_CURRENT_ROLE, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchTeam = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.group('FetchTeam given id: ', id);
      const response = await api.get(`/teams/${id}`);
      console.log(response.data);
      dispatch({ type: FETCH_TEAM, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchTeam');
      reject(e);
    }
  });
};

//TODO Combine these two
export const editUser = (userObj, id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('attempting to put values ', userObj);
      const response = await api.put(`/users/${id}`, userObj);
      console.log('attempting dispatch response: ', response);

      dispatch({ type: FETCH_USER, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in edituser');
      reject(e);
    }
  });
};

export const recruitUser = (userObj, id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('attempting to put values ', userObj);
      const response = await api.put(`/users/${id}`, userObj);
      console.log('attempting dispatch response: ', response);

      dispatch({ type: FETCH_USER, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in edituser');
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

export const fetchRegions = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/regions`);

      dispatch({ type: FETCH_REGIONS, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchR');
      reject(e);
    }
  });
};

export const createTeam = formValues => async dispatch => {
  console.log('Attempting to create team with values: ', formValues);
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
  console.log('Action has recieved: ', activityObj);
  return new Promise(async (resolve, reject) => {
    try {
      // create new activity, should contain minutes, activity type, team id , user id, event id
      const response = await api.post(`/useractivity`, activityObj);
      console.log('Here in the action, we have: ', response.data);
      dispatch({ type: CREATE_USER_ACTIVITY, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//Score Actions

export const fetchUserScore = (userId, eventId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // this fetches a specific user score for a specific event
      const response = await api.get(`/useractivity/user/${userId}/event/${eventId}`);
      dispatch({ type: FETCH_USER_SCORE, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in userscore');
      reject(e);
    }
  });
};

export const fetchAllUserScores = userId => async dispatch => {
  console.log('attemptin to fetch usrer scores');
  return new Promise(async (resolve, reject) => {
    try {
      // this fetches a specific user scores for ALL active events
      const response = await api.get(`/useractivity/user/${userId}`);
      console.log(response);
      dispatch({ type: FETCH_ALL_USER_SCORES, payload: response.data });
      resolve();
    } catch (e) {
      console.log('ERROR in userscores');
      reject(e);
    }
  });
};

export const fetchTeamScore = (teamId, eventId) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // specific team specific event
      const response = await api.get(`/useractivity/team/${teamId}/event/${eventId}`);
      dispatch({ type: FETCH_TEAM_SCORE, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchAllTeamScores = teamId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      // specific team all ACTIVE events
      const response = await api.get(`/useractivity/team/${teamId}`);
      dispatch({ type: FETCH_ALL_TEAM_SCORES, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchRoles = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/roles`);
      const resultToLower = response.data.map(element => {
        return { ...element, name: element.name.toLowerCase() };
      });

      dispatch({ type: FETCH_ROLES, payload: resultToLower });
      resolve();
    } catch (e) {
      console.log('ERROR in fetchRoles');
      reject(e);
    }
  });
};

//Team Requests

export const fetchAllRequests = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teamrequests/`);
      dispatch({ type: FETCH_ALL_REQUESTS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchRequest = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/teamrequests/${id}`);
      dispatch({ type: FETCH_REQUEST, payload: response.data });
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
      dispatch({ type: FETCH_REQUEST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
