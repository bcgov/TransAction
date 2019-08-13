import { api, isCancel } from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import {
  FETCH_ACTIVITY_LIST,
  CREATE_USER_ACTIVITY,
  FETCH_USER_SCORES,
  FETCH_TEAM_SCORES,
  FETCH_USER_EVENT_SCORE,
  FETCH_TEAM_EVENT_SCORE,
  FETCH_TEAM_STANDINGS,
  FETCH_REGION_STANDINGS,
  SHOW_ERROR_DIALOG_MODAL,
} from './types';

//Activity Actions

export const fetchActivityList = () => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get('/activities');
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_ACTIVITY_LIST, payload: data });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get('/activities')
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_ACTIVITY_LIST, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const createUserActivity = activityObj => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   // create new activity, should contain minutes, activity type, team id , user id, event id
    //   const response = await api.post(`/useractivity`, activityObj);
    //   const data = getApiReponseData(response);

    //   dispatch({ type: CREATE_USER_ACTIVITY, payload: data });
    //   dispatch(fetchUserEventScore(activityObj.userId, activityObj.eventId));
    //   dispatch(fetchTeamEventScore(activityObj.teamId, activityObj.eventId));

    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .post(`/useractivity`, activityObj)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_USER_ACTIVITY, payload: data });
        dispatch(fetchUserEventScore(activityObj.userId, activityObj.eventId));
        dispatch(fetchTeamEventScore(activityObj.teamId, activityObj.eventId));
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

//Score Actions

export const fetchUserEventScore = (userId, eventId) => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   // this fetches a specific user score for a specific event
    //   const response = await api.get(`/useractivity/user/${userId}/event/${eventId}`);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_USER_EVENT_SCORE, payload: { userId, eventId, data: data } });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/useractivity/user/${userId}/event/${eventId}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_USER_EVENT_SCORE, payload: { userId, eventId, data: data } });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchAllUserScores = (cancelTokenSource, userId) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/useractivity/user/${userId}`, { cancelToken: cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_USER_SCORES, payload: { userId, data: data } });
        resolve();
      })
      .catch(e => {
        if (isCancel(e)) {
          console.log('Request canceled', e.message);
        } else {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchTeamEventScore = (teamId, eventId) => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   // specific team specific event
    //   const response = await api.get(`/useractivity/team/${teamId}/event/${eventId}`);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_TEAM_EVENT_SCORE, payload: { teamId, eventId, data: data } });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/useractivity/team/${teamId}/event/${eventId}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM_EVENT_SCORE, payload: { teamId, eventId, data: data } });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchAllTeamScores = (cancelTokenSource, teamId) => dispatch => {
  return new Promise((resolve, reject) => {
    // specific team all ACTIVE events
    api
      .get(`/useractivity/team/${teamId}`, { cancelToken: cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_TEAM_SCORES, payload: { teamId, data: data } });
        resolve();
      })
      .catch(e => {
        if (isCancel(e)) {
          console.log('Request canceled', e.message);
        } else {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchTeamStandings = (eventId, teamCount = 20) => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get(`/useractivity/event/${eventId}/top/${teamCount}`);
    //   const data = getApiReponseData(response);

    //   dispatch({ type: FETCH_TEAM_STANDINGS, payload: { eventId, data: data } });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/useractivity/event/${eventId}/top/${teamCount}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM_STANDINGS, payload: { eventId, data: data } });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchRegionStandings = eventId => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get(`/useractivity/event/${eventId}/region`);
    //   const data = getApiReponseData(response);

    //   dispatch({ type: FETCH_REGION_STANDINGS, payload: { eventId, data: data } });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/useractivity/event/${eventId}/region`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_REGION_STANDINGS, payload: { eventId, data: data } });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};
