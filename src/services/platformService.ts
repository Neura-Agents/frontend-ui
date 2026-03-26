import { apiClient } from '../api/client';

const API_BASE_URL = '/backend/api/platform';

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    targeting_rules: {
        users: string[];
        roles: string[];
        percentage: number;
    };
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export const platformService = {
    getFeatures: async (): Promise<FeatureFlag[]> => {
        const response = await apiClient.get(`${API_BASE_URL}/features`);
        return response.data.features;
    },

    getFeatureByKey: async (key: string): Promise<FeatureFlag> => {
        const response = await apiClient.get(`${API_BASE_URL}/features/${key}`);
        return response.data.feature;
    },

    updateFeature: async (id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> => {
        const response = await apiClient.put(`${API_BASE_URL}/features/${id}`, data);
        return response.data.feature;
    },

    evaluateAll: async (): Promise<Record<string, boolean>> => {
        const response = await apiClient.get(`${API_BASE_URL}/features/evaluations`);
        return response.data.evaluations;
    },

    getRoles: async (): Promise<Role[]> => {
        const response = await apiClient.get(`${API_BASE_URL}/roles`);
        return response.data.roles;
    }
};
