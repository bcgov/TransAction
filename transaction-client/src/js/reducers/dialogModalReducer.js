import { TOGGLE_DIALOG_MODAL } from '../actions/types';

const DEFAULT_STATE = {
  isOpen: false,
  title: null,
  body: null,
  secondary: true,
  callback: null,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_DIALOG_MODAL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
