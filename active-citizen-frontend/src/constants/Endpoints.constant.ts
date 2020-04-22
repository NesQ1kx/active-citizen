const url = "http://localhost:24642/api";

export const USER = {
  SIGNUP: `${url}/user/signup`,
  GET_USER_DATA: `${url}/user/get`,
  SIGNIN: `${url}/user/signin`,
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
}