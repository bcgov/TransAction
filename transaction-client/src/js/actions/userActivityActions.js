import * as api from '../api/api';
import { getApiReponseData, buildApiErrorObject } from '../utils';
import {
  FETCH_ACTIVITY_LIST,
  CREATE_ACTIVITY_TYPE,
  EDIT_ACTIVITY_TYPE,
  DELETE_ACTIVITY_TYPE,
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
    api.instance
      .get('/activities', { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_ACTIVITY_LIST, payload: data });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const createActivityType = activityType => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .post(`/activities/`, activityType, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_ACTIVITY_TYPE, payload: data });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const editActivityType = (id, activityType) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .put(`/activities/${id}`, activityType, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: EDIT_ACTIVITY_TYPE, payload: data });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const deleteActivityType = id => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .delete(`/activities/${id}`, { cancelToken: api.cancelTokenSource.token })
      .then(() => {
        dispatch({ type: DELETE_ACTIVITY_TYPE, payload: id });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const createUserActivity = activityObj => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .post(`/useractivity`, activityObj, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_USER_ACTIVITY, payload: data });
        dispatch(fetchUserEventScore(activityObj.userId, activityObj.eventId));
        dispatch(fetchTeamEventScore(activityObj.teamId, activityObj.eventId));
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

//Score Actions

export const fetchUserEventScore = (userId, eventId) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/useractivity/score/user/${userId}/event/${eventId}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_USER_EVENT_SCORE, payload: { userId, eventId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchAllUserScores = userId => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/useractivity/score/user/${userId}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_USER_SCORES, payload: { userId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchTeamEventScore = (teamId, eventId) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/useractivity/score/team/${teamId}/event/${eventId}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM_EVENT_SCORE, payload: { teamId, eventId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchAllTeamScores = teamId => dispatch => {
  return new Promise((resolve, reject) => {
    // specific team all ACTIVE events
    api.instance
      .get(`/useractivity/score/team/${teamId}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);

        dispatch({ type: FETCH_TEAM_SCORES, payload: { teamId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchTeamStandings = (eventId, teamCount = 20) => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/useractivity/score/event/${eventId}/top/${teamCount}`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TEAM_STANDINGS, payload: { eventId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};

export const fetchRegionStandings = eventId => dispatch => {
  return new Promise((resolve, reject) => {
    api.instance
      .get(`/useractivity/score/event/${eventId}/region`, { cancelToken: api.cancelTokenSource.token })
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_REGION_STANDINGS, payload: { eventId, data: data } });
        resolve();
      })
      .catch(e => {
        if (!api.isCancel(e)) {
          dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
          reject(e);
        }
      });
  });
};
