import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Admin API calls
export const adminLogin = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const getImages = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/images`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

export const addImage = async (formData, token) => {
  const response = await axios.post(`${API_BASE_URL}/admin/images`, formData, {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteImage = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/images/${id}`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

export const getVotes = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/votes`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

export const getResults = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/results`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

// Public API calls
export const getVotingImages = async () => {
  const response = await axios.get(`${API_BASE_URL}/votes/images`);
  return response.data;
};

export const submitVote = async (imageId, name, nim) => {
  const response = await axios.post(`${API_BASE_URL}/votes/vote`, {
    imageId,
    name,
    nim
  });
  return response.data;
};

export const getVotingResults = async () => {
  const response = await axios.get(`${API_BASE_URL}/votes/results`);
  return response.data;
};

// Admin API calls
export const getVotes = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/votes`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

export const getSettings = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/settings`, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};

export const updateSettings = async (settings, token) => {
  const response = await axios.post(`${API_BASE_URL}/admin/settings`, settings, {
    headers: {
      'x-auth-token': token
    }
  });
  return response.data;
};