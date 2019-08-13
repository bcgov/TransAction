import { api } from '../api/api';
import { getApiReponseData, buildApiErrorObject, buildApiQueryString, getApiPagedReponseData } from '../utils';
import {
  FETCH_TOPICS,
  FETCH_TOPIC,
  EDIT_TOPIC,
  CREATE_TOPIC,
  CREATE_POST,
  EDIT_POST,
  SHOW_ERROR_DIALOG_MODAL,
} from './types';

import history from '../history';
import * as Constants from '../Constants';

export const fetchTopics = (title, page, pageSize) => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get(`/messageboard/?${buildApiQueryString(title, page, pageSize)}`);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_TOPICS, payload: data });
    //   resolve(getApiPagedReponseData(response).pageCount);
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/messageboard/?${buildApiQueryString(title, page, pageSize)}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TOPICS, payload: data });
        resolve(getApiPagedReponseData(response).pageCount);
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const fetchTopicDetail = topicId => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.get(`/messageboard/${topicId}`);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: FETCH_TOPIC, payload: data });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .get(`/messageboard/${topicId}`)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: FETCH_TOPIC, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const editTopic = topic => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.put(`/messageboard/${topic.id}`, topic);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: EDIT_TOPIC, payload: data });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .put(`/messageboard/${topic.id}`, topic)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: EDIT_TOPIC, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const createTopic = topic => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.post(`/messageboard`, topic);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: CREATE_TOPIC, payload: data });

    //   history.push(`${Constants.PATHS.MESSAGES}/${data.id}`);
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .post(`/messageboard`, topic)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_TOPIC, payload: data });

        history.push(`${Constants.PATHS.MESSAGES}/${data.id}`);
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const createPost = message => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.post(`/messageboard/message`, message);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: CREATE_POST, payload: data });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .post(`/messageboard/message`, message)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: CREATE_POST, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};

export const editPost = message => dispatch => {
  return new Promise((resolve, reject) => {
    // try {
    //   const response = await api.put(`/messageboard/message/${message.id}`, message);
    //   const data = getApiReponseData(response);
    //   dispatch({ type: EDIT_POST, payload: data });
    //   resolve();
    // } catch (e) {
    //   dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
    //   reject(e);
    // }

    api
      .put(`/messageboard/message/${message.id}`, message)
      .then(response => {
        const data = getApiReponseData(response);
        dispatch({ type: EDIT_POST, payload: data });
        resolve();
      })
      .catch(e => {
        dispatch({ type: SHOW_ERROR_DIALOG_MODAL, payload: buildApiErrorObject(e.response) });
        reject(e);
      });
  });
};
