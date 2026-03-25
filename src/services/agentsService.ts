import { apiClient } from '../api/client';

const BASE_URL = '/backend/api/agents';

export interface AgentCapability {
    capability_id: string;
    capability_type: 'tool' | 'mcp' | 'kb' | 'kg';
}

export interface CreateAgentDTO {
    name: string;
    slug?: string;
    icon: string;

    description: string;
    version: string;
    tags: string[];
    visibility: string;
    status: string;
    model_name: string;
    temperature: number;

    max_tokens: number;
    system_prompt: string;
    capabilities: AgentCapability[];
}

export const agentsService = {
    async createAgent(dto: CreateAgentDTO) {
        const response = await apiClient.post(BASE_URL, dto);
        return response.data;
    },

    async getAgents(options: { query?: string, page?: number, limit?: number } = {}) {
        const response = await apiClient.get(BASE_URL, { params: options });
        return response.data;
    },

    async getAgentById(idOrSlug: string) {
        const response = await apiClient.get(`${BASE_URL}/${idOrSlug}`);
        return response.data;
    },

    async updateAgent(idOrSlug: string, dto: CreateAgentDTO) {
        const response = await apiClient.put(`${BASE_URL}/${idOrSlug}`, dto);
        return response.data;
    },
    async deleteAgent(idOrSlug: string) {
        await apiClient.delete(`${BASE_URL}/${idOrSlug}`);
    }
};

