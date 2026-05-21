import axios from "axios";

const baseURL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: baseURL
});

export default api;