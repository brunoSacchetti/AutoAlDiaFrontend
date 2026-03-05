import api from './api';
import type { Usuario, UsuarioCreate } from '../types';

// Since the backend doesn't have JWT/auth yet, we simulate login
// by searching for the user by email from the list of all users.

export const authService = {
    /**
     * Simulated login: fetches all users and finds one matching email + password.
     * In a real implementation, this would be a POST to /api/auth/login.
     */
    async login(email: string, _password: string): Promise<Usuario> {
        // For now, we create a user or find an existing one
        // The backend doesn't expose a login endpoint yet,
        // so we fetch all users and match by email
        const response = await api.get<Usuario[]>('/usuarios/obtenerTodos');
        const usuario = response.data.find((u) => u.email === email);

        if (!usuario) {
            throw new Error('Usuario no encontrado. Verificá tu email.');
        }

        // Note: Password verification happens on the backend in a real implementation.
        // For now we trust the frontend match since there's no auth endpoint.
        return usuario;
    },

    /**
     * Register a new user via the backend API.
     */
    async register(data: UsuarioCreate): Promise<Usuario> {
        const response = await api.post<Usuario>('/usuarios/crear', data);
        return response.data;
    },
};
