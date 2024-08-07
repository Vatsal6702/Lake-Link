import axios from 'axios';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

const MMKV = new MMKVLoader().initialize();

// Set the base URL for your API
axios.defaults.baseURL = 'http://65.1.214.43:3307/api';

// Create an Axios instance
const axiosInstance = axios.create();

// Add an interceptor for requests
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get the access token from storage and set it in the request headers
        const token = await MMKV.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add an interceptor for responses
axiosInstance.interceptors.response.use(
    (response) => {
        // Process successful responses
        return response;
    },
    (error) => {
        // Process error responses
        return Promise.reject(error);
    }
);

export default axiosInstance;
