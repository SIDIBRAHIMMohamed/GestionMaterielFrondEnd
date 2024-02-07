import axios from 'axios';

const API_URL = 'http://localhost:9090/api/utilisateurs';
const API_URL2 = 'http://localhost:9090/api';

export default {
  getAllUsers() {
    return axios.get(API_URL);
  },
  getUserById(id) {
    return axios.get(`${API_URL}/${id}`);
  },
  createUser(user) {
    return axios.post(API_URL, user);
  },
  updateUser(id, user) {
    return axios.put(`${API_URL}/${id}`, user);
  },
  deleteUser(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
  login(loginRequest) {
    return axios.post(`${API_URL2}/login`,loginRequest);
  }
  
  
};
