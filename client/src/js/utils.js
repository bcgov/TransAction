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

// This function is for compatibility purposes.  API response used to contain only the data.
// This was changed midway to include other data with the API response data
export const getApiReponseData = response => {
  return response.data.data ? response.data.data : response.data;
};

export const getApiPagedReponseData = response => {
  return { data: response.data.data, pageCount: response.data.pageCount };
};

export const buildApiErrorObject = response => {
  try {
    const method = response.config.method.toUpperCase();
    const path = response.config.url.replace(response.config.baseURL, '');

    return {
      message: response.data.message,
      statusCode: response.status,
      path,
      method,
    };
  } catch {
    return {
      message: 'Connection to server cannot be established',
    };
  }
};

export const buildApiQueryString = (searchTerm, page, pageSize, isActive) => {
  const queries = [];
  if (searchTerm) queries.push(`name=${searchTerm}`);
  if (page) queries.push(`page=${page}`);
  if (pageSize) queries.push(`pageSize=${pageSize}`);
  if (!isActive) queries.push(`isActive=${isActive}`);

  return queries.join('&');
};
