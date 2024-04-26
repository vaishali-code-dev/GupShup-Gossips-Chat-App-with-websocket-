import axios from "axios";
import { BASE_URL } from "../constant";

const signUpUser = (payload) => {
  return axios.post(`${BASE_URL}/api/register`, payload);
};

const loginUser = (payload) => {
  return axios.post(`${BASE_URL}/api/login`, payload);
};

const getUsers = (payload) => {
  return axios.post(`${BASE_URL}/api/users`);
};

const getUserDetails = (token) => {
  return axios.get(`${BASE_URL}/api/getUserFromToken/${token}`);
};

const logoutUser = (id) => {
  return axios.post(`${BASE_URL}/api/logoutUser/${id}`);
};

const googleLoginApi = (codeResponse) => {
  return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
    headers: {
      Authorization: `Bearer ${codeResponse.access_token}`,
      Accept: "application/json",
    },
  });
};

const googleLoginUser = (payload) => {
  return axios.post(`${BASE_URL}/api/googleAuth/login`, payload);
};

export { signUpUser, loginUser, getUsers, getUserDetails, logoutUser, googleLoginApi, googleLoginUser };
