import { apiClient } from '../api/client';

const BASE_URL = '/backend/api/mcp';

export interface McpServer {
    server_id: string;
    server_name: string;
    status: string;
    transport: string;
    url: string;
    description: string;
    visibility: 'public' | 'private';
    user_id: string;
}

export interface McpTool {
    name: string;
    description?: string;
    inputSchema?: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
    };
}

export const mcpService = {
    async getServers(options: { query?: string, page?: number, limit?: number } = {}): Promise<{ mcp_servers: McpServer[], total: number }> {
        const response = await apiClient.get(`${BASE_URL}/servers`, { params: options });
        return {
            mcp_servers: response.data?.mcp_servers || [],
            total: response.data?.total || 0
        };
    },

    async getTools(serverId?: string): Promise<McpTool[]> {
        const response = await apiClient.get(`${BASE_URL}/tools`, {
            params: serverId ? { server_id: serverId } : {}
        });
        return response.data?.tools || response.data || [];
    },

    async callTool(name: string, args: any): Promise<any> {
        const response = await apiClient.post(`${BASE_URL}/call`, {
            name,
            arguments: args
        });
        return response.data;
    },

    async syncTools(): Promise<{ success: boolean; serverCount: number; toolCount: number }> {
        const response = await apiClient.post(`${BASE_URL}/sync`);
        return response.data;
    },

    async testTools(data: { server_name: string, url: string, transport: string, auth_type: string }): Promise<McpTool[]> {
        const response = await apiClient.post(`${BASE_URL}/test-tools`, data);
        return response.data?.tools || response.data || [];
    },

    async createMcpServer(data: any): Promise<any> {
        const response = await apiClient.post(`${BASE_URL}/server`, data);
        return response.data;
    },

    async updateMcpServer(data: any): Promise<any> {
        const response = await apiClient.put(`${BASE_URL}/server`, data);
        return response.data;
    },

    async deleteMcpServer(serverId: string): Promise<any> {
        const response = await apiClient.delete(`${BASE_URL}/server/${serverId}`);
        return response.data;
    }
};

