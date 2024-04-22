import axios from "axios";
import { BASE_URL } from "../constant";

const sendMessageApi = (payload) => {
  return axios.post(`${BASE_URL}/api/message`, payload);
};

const getMessages = ({ convId }) => {
  return axios.get(`${BASE_URL}/api/message/${convId}`);
};

export { sendMessageApi, getMessages };
