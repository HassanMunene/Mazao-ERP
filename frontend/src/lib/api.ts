import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('jwt');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);