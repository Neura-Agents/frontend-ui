import axios from 'axios';

const KONG_URL = import.meta.env.VITE_API_URL;

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

apiClient.interceptors.response.use(
    (response) => {
        if ((window as any).umami) {
            (window as any).umami.track('api-success', {
                url: response.config?.url,
                method: response.config?.method,
            });
        }
        return response;
    },
    (error) => {
        // Track the error in Umami
        if ((window as any).umami) {
            (window as any).umami.track('api-error', {
                status: error.response?.status,
                url: error.config?.url,
                method: error.config?.method,
                message: error.message
            });
        }
        
        if (error.response?.status === 402) {
            const errorData = error.response.data;
            // Throw a more useful error object for 402s
            return Promise.reject({
                status: 402,
                message: errorData.message || 'Insufficient balance',
                balance: errorData.balance,
                originalError: error
            });
        }
        return Promise.reject(error);
    }
);
