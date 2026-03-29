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

export interface Prompt {
    id: string;
    name: string;
    type: string;
    content: string;
    prompt_text?: string;
    metadata?: Record<string, any>;
    storage_path: string;
    is_active: boolean;
    targeting_users?: string[];
    targeting_agents?: string[];
    targeting_roles?: string[];
    created_at: string;
    updated_at: string;
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
    },

    listPrompts: async (options?: {
        type?: string,
        page?: number,
        limit?: number,
        promptId?: string,
        name?: string,
        q?: string
    }): Promise<{ prompts: Prompt[], total: number, totalPages: number }> => {
        const response = await apiClient.get(`${API_BASE_URL}/prompts/list`, { params: options });
        return response.data;
    },

    uploadPrompt: async (file: File, name: string, type: string): Promise<Prompt> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('type', type);
        const response = await apiClient.post(`${API_BASE_URL}/prompts/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.prompt;
    },

    getActivePrompt: async (type: string): Promise<Prompt> => {
        const response = await apiClient.get(`${API_BASE_URL}/prompts/active/${type}`);
        return response.data.prompt;
    },

    activatePrompt: async (id: string): Promise<Prompt> => {
        const response = await apiClient.put(`${API_BASE_URL}/prompts/${id}/activate`);
        return response.data.prompt;
    },

    updatePromptTargeting: async (id: string, targeting: { users?: string[], agents?: string[], roles?: string[] }): Promise<any> => {
        const response = await apiClient.put(`${API_BASE_URL}/prompts/${id}/targeting`, targeting);
        return response.data;
    },

    getPromptTypes: async (): Promise<{ id: string, name: string, description: string }[]> => {
        const response = await apiClient.get(`${API_BASE_URL}/prompts/types`);
        return response.data.types;
    },

    getNavigation: async (): Promise<{ sidebar: any[], all_urls: any[] }> => {
        const response = await apiClient.get(`${API_BASE_URL}/navigation`);
        return response.data;
    },
    getPricing: async (): Promise<{ plans: any[], faqs: any[] }> => {
        const response = await apiClient.get(`${API_BASE_URL}/pricing`);
        return response.data.data;
    }
};
