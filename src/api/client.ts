import axios from 'axios';

const KONG_URL = 'http://localhost:8000';

export const apiClient = axios.create({
    baseURL: KONG_URL,
    headers: {
        'Accept': 'application/json',
    }
});

let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    currentToken = token;
};

export const getAuthToken = () => currentToken;

apiClient.interceptors.request.use((config) => {
    if (currentToken) {
        config.headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
