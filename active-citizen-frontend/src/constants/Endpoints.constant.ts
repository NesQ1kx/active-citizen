const url = "http://localhost:24642/api";

export const USER = {
  SIGNUP: `${url}/user/signup`,
  GET_USER_DATA: `${url}/user/get`,
  SIGNIN: `${url}/user/signin`,
  GET_USER_BY_ID: `${url}/user/get-by-id`,
  CONFIRM_EMAIL: `${url}/user/confirm`,
  NOTIFY: `${url}/user/notify`,
  UPDATE_USER: `${url}/user/update-role`,
  TOGGLE_BLOCK: `${url}/user/toggle-block`,
  UPDATE_AVATAR: `${url}/user/update-avatar`,
  DELETE_AVATAR: `${url}/user/delete-avatar`,
  EDIT_PROFILE: `${url}/user/edit-profile`,
  SEARCH_USERS: `${url}/user/search-users`,
  CHANGE_PASSWORD: `${url}/user/change-password`,
  REQUEST_RESET: `${url}/user/request-reset`,
  RESET_PASSWORD: `${url}/user/reset-password`,
}

export const PROJECT = {
  LOAD: `${url}/project/load`,
  ALL: `${url}/project/all`,
  BY_ID: `${url}/project`,
  UPDATE: `${url}/project/update`,
  DELETE: `${url}/project/delete`,
  PARTICIPATE: `${url}/project/participate`,
  IS_PARTICIPATE: `${url}/project/isParicipate`,
  GET_DIRECTION: `${url}/project/direction`,
  ADD_IDEA: `${url}/project/add-idea`,
  GET_IDEAS: `${url}/project/ideas`,
  UPDATE_IDEA: `${url}/project/update-idea`,
  GET_IDEA: `${url}/project/idea`,
  VOTE: `${url}/project/vote`,
  IS_VOTED: `${url}/project/isVoted`,
  REALISE_IDEA: `${url}/project/realise-idea`,
  PARTICIPANTS: `${url}/project/participants`,
  USER_IDEAS: `${url}/project/user-ideas`,
}
export const COMMON = {
  ADD_NEWS: `${url}/common/add-news`,
  GET_ALL_NEWS: `${url}/common/get-all-news`,
  GET_NEWS: `${url}/common/get-news`,
  DELETE_NEWS: `${url}/common/delete-news`,
  EDIT_NEWS: `${url}/common/edit-news`
}