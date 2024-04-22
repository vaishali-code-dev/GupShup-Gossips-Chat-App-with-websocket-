import axios from "axios";

const BASE_URL = "http://localhost:8088";

const createConversation = (payload) => {
  return axios.post(`${BASE_URL}/api/conversation`, payload);
};

const getConversation = (id) => {
  return axios.get(`${BASE_URL}/api/conversation/${id}`);
};

export { createConversation, getConversation };
