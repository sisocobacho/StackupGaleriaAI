import API from "./api.js";

export const login = (credentials) => API.post('/token/', credentials);

