import axios from "axios";



let axiosConfig = {
  baseURL: "http://localhost:3000",
  withCredentials: true,
};




const api = axios.create(axiosConfig);

export default api;