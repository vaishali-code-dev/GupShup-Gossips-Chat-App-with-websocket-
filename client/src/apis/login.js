import axios from "axios";

const BASE_URL = "http://localhost:8088";

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

export { signUpUser, loginUser, getUsers, getUserDetails, logoutUser };
