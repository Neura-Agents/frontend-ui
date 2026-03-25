import { apiClient } from '../api/client';
import type { Tool } from '../components/tools/tool-card';

const BASE_URL = '/backend/api/tools';

export const toolsService = {
    async getTools(page = 1, limit = 10, search = ''): Promise<{ tools: Tool[], total: number, page: number, totalPages: number }> {
        const response = await apiClient.get(BASE_URL, {
            params: { page, limit, search }
        });
        return response.data;
    },

    async createTool(tool: Partial<Tool> | Partial<Tool>[]): Promise<Tool | Tool[]> {
        const response = await apiClient.post(BASE_URL, tool);
        return response.data;
    },

    async updateTool(id: string, tool: Partial<Tool>): Promise<Tool> {
        const response = await apiClient.put(`${BASE_URL}/${id}`, tool);
        return response.data;
    },

    async deleteTool(id: string): Promise<void> {
        await apiClient.delete(`${BASE_URL}/${id}`);
    },

    async checkConflicts(tools: Partial<Tool>[]): Promise<{ existing: { id: string, name: string, path: string, method: string }, incoming: Partial<Tool> }[]> {
        const response = await apiClient.post(`${BASE_URL}/conflicts`, { tools });
        return response.data;
    },

    async executeTool(name: string, parameters: any = {}): Promise<any> {
        const response = await apiClient.post(`${BASE_URL}/execute`, { name, parameters });
        return response.data;
    }
};
