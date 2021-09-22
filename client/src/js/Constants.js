export const ROLE = { ADMIN: 'admin', USER: 'user', TEAM_LEAD: 'team_lead' };

export const PATHS = {
  EVENT: '/event',
  PROFILE: '/profile',
  TEAM: '/team',
  START: '/start',
  FAQ: '/faq',
  FAQ_HEALTH: '/faq#health',
  FAQ_WELLNESS: '/faq#wellness',
  INCENTIVES: '/incentives',
  MESSAGES: '/messages',
  ADMIN: '/admin',
  FREE_AGENTS: '/freeagents',
};

export const FORM_TYPE = { ADD: 'add', EDIT: 'edit' };

export const PROFILE_TYPE = { TEAM: 'team', USER: 'user' };

export const USER_SCORE_CARD_WIDTH = { WIDE: 'wide', NARROW: 'narrow' };

export const MARKDOWN = {
  ALLOWED: [
    'html', //root
    'text',
    'br', //break
    'p', //paragraph
    'strong', //strong
    'em', //emphasis
    'hr', //thematicBreak
    'del', //deleted
    'ol', //lists
    'ul',
    'li', //list item
    'h1', //headings
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre', //needed for code elements to be displayed
    'code',
  ],
};

export const MESSAGE_DATE_FORMAT = 'YYYY-MM-DD hh:mmA';

export const API_URL = window.RUNTIME_REACT_APP_API_HOST
  ? `${window.location.protocol}//${window.RUNTIME_REACT_APP_API_HOST}/api`
  : process.env.REACT_APP_API_HOST;
