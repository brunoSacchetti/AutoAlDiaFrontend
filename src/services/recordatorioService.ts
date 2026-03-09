import api from './api';
import type { RecordatorioMantenimiento, RecordatorioCreate } from '../types';

export const recordatorioService = {
    /**
     * Obtiene todos los recordatorios activos para todos los vehículos de un usuario.
     */
    async getActivosByUsuarioId(usuarioId: number): Promise<RecordatorioMantenimiento[]> {
        const response = await api.get<RecordatorioMantenimiento[]>(`/recordatorio/usuario/${usuarioId}/activos`);
        return response.data;
    },

    /**
     * Obtiene un recordatorio puntual por ID.
     */
    async getById(id: number): Promise<RecordatorioMantenimiento> {
        const response = await api.get<RecordatorioMantenimiento>(`/recordatorio/obtener/${id}`);
        return response.data;
    },

    /**
     * Obtiene todos los recordatorios asociados a un vehículo específico.
     */
    async getByVehiculoId(vehiculoId: number): Promise<RecordatorioMantenimiento[]> {
        const response = await api.get<RecordatorioMantenimiento[]>(`/recordatorio/vehiculo/${vehiculoId}`);
        return response.data;
    },

    /**
     * Crea un nuevo recordatorio.
     */
    async create(data: RecordatorioCreate): Promise<RecordatorioMantenimiento> {
        const response = await api.post<RecordatorioMantenimiento>('/recordatorio/crear', data);
        return response.data;
    },

    /**
     * Actualiza un recordatorio existente.
     */
    async update(id: number, data: Partial<RecordatorioCreate>): Promise<RecordatorioMantenimiento> {
        const response = await api.put<RecordatorioMantenimiento>(`/recordatorio/actualizar/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un recordatorio.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/recordatorio/eliminar/${id}`);
    },
};
