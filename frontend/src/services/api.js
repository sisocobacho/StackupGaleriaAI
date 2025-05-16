import axios from 'axios';

const API = axios.create({
   baseURL: process.env.REACT_APP_SERVER_URL,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  console.log("intercepting");
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(config);
  };
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error", error);
    if (error?.response === undefined){
      alert("Can't reach server");
      window.location = '/login';
    }
    if (error?.response?.status === 401) {
      console.log("error authentication", error);
      localStorage.removeItem('access_token');
      window.location = '/login';
    } 
    
    return Promise.reject(error);
  }
); 

export default API;
