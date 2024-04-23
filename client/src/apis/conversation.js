import axios from "axios";
import { BASE_URL } from "../constant";

const createConversation = (payload) => {
  return axios.post(`${BASE_URL}/api/conversation`, payload);
};

const getConversation = (id) => {
  return axios.get(`${BASE_URL}/api/conversation/${id}`);
};

export { createConversation, getConversation };
