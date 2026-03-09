import api from './api';
import type { Documento, DocumentoCreate } from '../types';

export const documentoService = {
    /**
     * Obtiene todos los documentos (y luego filtramos en el frontend)
     * ya que los endpoints específicos en el backend están comentados.
     */
    async getAll(): Promise<Documento[]> {
        const response = await api.get<Documento[]>('/documento/obtener');
        return response.data;
    },

    /**
     * Obtiene un documento puntual por ID.
     */
    async getById(id: number): Promise<Documento> {
        const response = await api.get<Documento>(`/documento/obtener/${id}`);
        return response.data;
    },

    /**
     * Obtiene los documentos filtrando por vehiculoId localmente.
     */
    async getByVehiculoId(vehiculoId: number): Promise<Documento[]> {
        const todos = await this.getAll();
        return todos.filter(d => d.vehiculoId === vehiculoId);
    },

    /**
     * Crea un nuevo documento.
     */
    async create(data: DocumentoCreate): Promise<Documento> {
        const response = await api.post<Documento>('/documento/crear', data);
        return response.data;
    },

    /**
     * Actualiza un documento existente.
     */
    async update(id: number, data: Partial<DocumentoCreate>): Promise<Documento> {
        const response = await api.put<Documento>(`/documento/actualizar/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un documento.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/documento/eliminarDocumento/${id}`);
    },
};
