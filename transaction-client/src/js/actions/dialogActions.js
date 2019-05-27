import { TOGGLE_DIALOG_MODAL } from './types';

export const showGlobalModal = ({ title, body, secondary, callback }) => {
  console.log(callback);
  return {
    type: TOGGLE_DIALOG_MODAL,
    payload: { isOpen: true, title, body, secondary, callback },
  };
};

export const hideGlobalModal = () => {
  return {
    type: TOGGLE_DIALOG_MODAL,
    payload: { isOpen: false, callback: null, secondary: true, title: null, body: null },
  };
};
