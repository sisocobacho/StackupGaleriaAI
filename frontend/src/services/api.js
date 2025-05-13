import axios from 'axios';

const API = axios.create({
   baseURL: process.env.REACT_APP_SERVER_URL,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const fetchPhotos = () => API.get('photos/');
export const fetchPhoto = (id) => API.get(`photos/${id}/`);
export const createPhoto = (photo) => {
  const formData = new FormData();
  formData.append('title', photo.title);
  formData.append('description', photo.description || '');
  formData.append('image', photo.image);
  return API.post('photos/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const login = (credentials) => API.post('auth/login/', credentials);
export const register = (userData) => API.post('auth/register/', userData);
