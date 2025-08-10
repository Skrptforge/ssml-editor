import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // This is important for cookies to be sent with requests
  withCredentials: true
});

export default api;
