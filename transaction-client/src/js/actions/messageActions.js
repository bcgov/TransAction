import api from '../api/api';
import { FETCH_TOPICS, FETCH_TOPIC } from './types';

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