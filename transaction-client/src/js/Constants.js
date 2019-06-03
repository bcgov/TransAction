export const ROLE = { ADMIN: 'admin', USER: 'user', TEAM_LEAD: 'team_lead' };

export const PATHS = {
  EVENT: '/event',
  PROFILE: '/profile',
  TEAM: '/team',
  START: '/start',
  FAQ: '/faq',
  INCENTIVES: '/incentives',
  MESSAGES: '/messages',
  ADMIN: '/admin',
};

export const FORM_TYPE = { ADD: 'add', EDIT: 'edit' };

export const PROFILE_TYPE = { TEAM: 'team', USER: 'user' };

export const USER_SCORE_CARD_WIDTH = { WIDE: 'wide', NARROW: 'narrow' };

export const MARKDOWN = {
  ALLOWED: [
    'root',
    'text',
    'break',
    'paragraph',
    'strong',
    'emphasis',
    'thematicBreak',
    'delete',
    'list',
    'listItem',
    'heading',
    'code',
  ],
};

export const API_URL = window.RUNTIME_REACT_APP_API_HOST
  ? `${window.location.protocol}//${window.RUNTIME_REACT_APP_API_HOST}/api`
  : process.env.REACT_APP_API_HOST;
