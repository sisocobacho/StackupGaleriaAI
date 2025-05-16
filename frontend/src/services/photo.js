import API from "./api.js";

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
