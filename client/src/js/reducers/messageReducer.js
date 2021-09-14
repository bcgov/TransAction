import { FETCH_TOPICS, FETCH_TOPIC, EDIT_TOPIC, CREATE_TOPIC, CREATE_POST, EDIT_POST } from '../actions/types';
import _ from 'lodash';

const DEFAULT_STATE = {};

const messageReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH_TOPICS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case FETCH_TOPIC:
      return { ...state, [action.payload.id]: { ...state[action.payload.id], ...action.payload } };
    case CREATE_POST:
    case EDIT_TOPIC:
    case EDIT_POST:
    case CREATE_TOPIC: //   const messages = [...state[action.payload.topicId].messages, action.payload];
      //   console.log(messages);
      return state;
    default:
      return state;
  }
};

export default messageReducer;
