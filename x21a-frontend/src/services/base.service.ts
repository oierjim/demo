import api from '../api';

export class BaseService<T> {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAll(): Promise<T[]> {
        const response = await api.get<T[]>(this.baseUrl);
        return response.data;
    }

    async filter(filterRequest: any): Promise<{ data: T[], totalRecords: number, page: number }> {
        const response = await api.post(`${this.baseUrl}/filter`, filterRequest);
        return response.data;
    }

    async getById(id: string | number): Promise<T> {
        const response = await api.get<T>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const response = await api.post<T>(this.baseUrl, data);
        return response.data;
    }

    async update(id: string | number, data: Partial<T>): Promise<T> {
        const response = await api.put<T>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    async delete(id: string | number): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async deleteMultiple(ids: (string | number)[]): Promise<void> {
        await api.post(`${this.baseUrl}/delete-multiple`, ids);
    }
}