import api from './api';
import type { Vehiculo, VehiculoCreate } from '../types';

export const vehiculoService = {
    /**
     * Obtiene todos los vehículos asociados a un usuario específico.
     */
    async getByUsuarioId(usuarioId: number): Promise<Vehiculo[]> {
        const response = await api.get<Vehiculo[]>(`/vehiculos/usuario/${usuarioId}`);
        return response.data;
    },

    /**
     * Obtiene un vehículo específico por su ID.
     */
    async getById(id: number): Promise<Vehiculo> {
        const response = await api.get<Vehiculo>(`/vehiculos/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo vehículo.
     */
    async create(data: VehiculoCreate): Promise<Vehiculo> {
        const response = await api.post<Vehiculo>('/vehiculos/crear', data);
        return response.data;
    },

    /**
     * Actualiza un vehículo existente.
     */
    async update(id: number, data: Partial<VehiculoCreate>): Promise<Vehiculo> {
        const response = await api.put<Vehiculo>(`/vehiculos/actualizar/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un vehículo.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/vehiculos/eliminar/${id}`);
    },
};
