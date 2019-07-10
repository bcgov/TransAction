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

export const isCurrentUserTeamlead = () => {
  const state = store.getState();
  try {
    const user = state.users.all[state.users.current.id];
    const team = state.teams[user.teamId];

    return user.teamId && user.id === team.teamLeaderId;
  } catch {
    console.error('Unable to verify team leader status.');
  }

  return false;
};

export const getApiReponseData = response => {
  return response.data.data ? response.data.data : response.data;
};
