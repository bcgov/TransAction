import api from '../api/api';
import { FETCH_TOPICS, FETCH_TOPIC, EDIT_TOPIC, CREATE_TOPIC, CREATE_POST, EDIT_POST } from './types';

import history from '../history';
import * as Constants from '../Constants';

export const fetchTopics = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get('/messageboard');
      dispatch({ type: FETCH_TOPICS, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchTopicDetail = topicId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.get(`/messageboard/${topicId}`);
      dispatch({ type: FETCH_TOPIC, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const editTopic = topic => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/messageboard/${topic.id}`, topic);
      dispatch({ type: EDIT_TOPIC, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const createTopic = topic => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/messageboard`, topic);
      dispatch({ type: CREATE_TOPIC, payload: response.data });

      history.push(`${Constants.PATHS.MESSAGES}/${response.data.id}`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const createPost = message => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post(`/messageboard/message`, message);
      dispatch({ type: CREATE_POST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const editPost = message => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(`/messageboard/message/${message.id}`, message);
      dispatch({ type: EDIT_POST, payload: response.data });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
