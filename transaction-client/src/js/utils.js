import store from './store';

import * as Constants from './Constants';

export const buildActionWithParam = (action, param) => {
  return { action, param };
};

export const isCurrentUserAdmin = () => {
  const state = store.getState();
  try {
    const user = state.users.all[state.users.current.id];
    const role = state.roles[user.roleId];

    return role.name === Constants.ROLE.ADMIN;
  } catch {
    console.error('Unable to verify admin status.');
  }

  return false;
};
