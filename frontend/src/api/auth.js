import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async (endpoint, headers = {}) => {
  try {
    const response = await apiClient.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint, data, headers = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

//api/movie/delete-movie