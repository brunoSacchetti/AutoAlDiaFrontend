import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || 'Error en el servidor';
            console.error(`[API Error] ${error.response.status}: ${message}`);
        } else if (error.request) {
            // No response received
            console.error('[API Error] No se recibió respuesta del servidor');
        } else {
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
