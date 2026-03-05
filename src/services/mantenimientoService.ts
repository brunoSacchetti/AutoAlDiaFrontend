import api from './api';
import type { Mantenimiento, MantenimientoCreate } from '../types';

export const mantenimientoService = {
    /**
     * Obtiene todos los mantenimientos asociados a un vehículo específico.
     */
    async getByVehiculoId(vehiculoId: number): Promise<Mantenimiento[]> {
        const response = await api.get<Mantenimiento[]>(`/mantenimiento/vehiculo/${vehiculoId}`);
        return response.data;
    },

    /**
     * Crea un nuevo registro de mantenimiento.
     */
    async create(data: MantenimientoCreate): Promise<Mantenimiento> {
        const response = await api.post<Mantenimiento>('/mantenimiento/crear', data);
        return response.data;
    },

    /**
     * Actualiza un mantenimiento existente.
     */
    async update(id: number, data: Partial<MantenimientoCreate>): Promise<Mantenimiento> {
        const response = await api.put<Mantenimiento>(`/mantenimiento/actualizar/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un mantenimiento.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/mantenimiento/eliminar/${id}`);
    },

    /**
     * Obtiene el gasto total en mantenimiento para un vehículo específico.
     */
    async getGastoTotal(vehiculoId: number): Promise<number> {
        const response = await api.get<number>(`/mantenimiento/vehiculo/${vehiculoId}/gasto-total`);
        return response.data;
    },
};
