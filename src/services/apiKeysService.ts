import { apiClient } from '../api/client';

const API_BASE_URL = '/backend/api/api-keys';

export interface ApiKey {
    id: string;
    user_id: string;
    name: string;
    key_prefix: string;
    last_four: string;
    status: 'active' | 'revoked';
    is_default: boolean;
    created_at: string;
}

export const apiKeysService = {
    listKeys: async (): Promise<ApiKey[]> => {
        const response = await apiClient.get(`${API_BASE_URL}?status=active`);
        return response.data;
    },

    createKey: async (name: string): Promise<{ apiKey: string; data: ApiKey }> => {
        const response = await apiClient.post(API_BASE_URL, { name });
        return response.data;
    },

    revokeKey: async (id: string): Promise<void> => {
        await apiClient.delete(`${API_BASE_URL}/${id}`);
    },

    rotateKey: async (id: string): Promise<{ apiKey: string; data: ApiKey }> => {
        const response = await apiClient.post(`${API_BASE_URL}/${id}/rotate`);
        return response.data;
    }
};
