import axios from 'axios';
import { getAuth } from '@react-native-firebase/auth';
const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEBRTC_ENDPOINT,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    const token = await getAuth()?.currentUser?.getIdToken(); // Retrieve this dynamically, e.g., from storage
  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

export default client;