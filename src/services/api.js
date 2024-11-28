// src/services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://assignment.stage.crafto.app';
const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || 'https://crafto.app/crafto/v1.0/media/assignment';

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token })
    }
  });
};

export const loginUser = async (username, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Login failed');
  }
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${MEDIA_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.mediaUrl;
  } catch (error) {
    throw error.response?.data || new Error('Upload failed');
  }
};

export const createQuote = async (token, text, mediaUrl) => {
  try {
    const api = createAxiosInstance(token);
    const response = await api.post('/postQuote', { text, mediaUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Quote creation failed');
  }
};

export const getQuotes = async (token, limit = 20, offset = 0) => {
  try {
    const api = createAxiosInstance(token);
    const response = await api.get('/getQuotes', { 
      params: { limit, offset } 
    });
    return response.data || [];
  } catch (error) {
    throw error.response?.data || new Error('Fetching quotes failed');
  }
};