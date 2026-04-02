import { apiClient } from '../api/client';

export interface Usage {
    id: string;
    execution_id: string;
    resource_id: string;
    resource_type: string;
    action_type: string;
    api_key?: string;
    user_id: string;
    total_input_tokens: number;
    total_completion_tokens: number;
    total_tokens: number;
    total_cost: number;
    initial_request: any;
    final_response: any;
    llm_calls: any[];
    created_at: string;
    apiKeyName?: string;
    agentName?: string;
    resourceName?: string;
    resource_name?: string;
    agent_name?: string;
    kb_name?: string;
    kg_name?: string;
    api_key_name?: string;
}

export interface UsageFilter {
    resource_id?: string;
    resource_type?: string;
    action_type?: string;
    api_key?: string;
    user_id?: string;
    execution_id?: string;
    search?: string;
    start_time?: string;
    end_time?: string;
    limit?: number;
    page?: number;
}

const BASE_URL = '/backend/api/platform/usage';

export const usageService = {
    async listUsage(filter: UsageFilter = {}): Promise<{ items: Usage[], total: number }> {
        const params = new URLSearchParams();
        if (filter.resource_id && filter.resource_id !== 'all') params.append('resource_id', filter.resource_id);
        if (filter.resource_type && filter.resource_type !== 'all') params.append('resource_type', filter.resource_type);
        if (filter.action_type && filter.action_type !== 'all') params.append('action_type', filter.action_type);
        if (filter.api_key && filter.api_key !== 'all') params.append('api_key', filter.api_key);
        if (filter.user_id) params.append('user_id', filter.user_id);
        if (filter.execution_id) params.append('execution_id', filter.execution_id);
        if (filter.search) params.append('search', filter.search);
        if (filter.start_time) params.append('start_time', filter.start_time);
        if (filter.end_time) params.append('end_time', filter.end_time);
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.page) params.append('page', filter.page.toString());

        const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
        const data = response.data;
        const rawItems = data.items || [];
        const total = data.total || 0;
        
        // Cast numeric fields from strings to numbers (pg NUMERIC returns as string)
        const items = rawItems.map((item: any) => ({
            ...item,
            total_cost: Number(item.total_cost || 0),
            total_tokens: Number(item.total_tokens || 0),
            total_input_tokens: Number(item.total_input_tokens || 0),
            total_completion_tokens: Number(item.total_completion_tokens || 0)
        }));

        return { items, total };
    },

    async getUsageStats(filter: UsageFilter = {}): Promise<Usage[]> {
        const params = new URLSearchParams();
        if (filter.resource_id && filter.resource_id !== 'all') params.append('resource_id', filter.resource_id);
        if (filter.resource_type && filter.resource_type !== 'all') params.append('resource_type', filter.resource_type);
        if (filter.action_type && filter.action_type !== 'all') params.append('action_type', filter.action_type);
        if (filter.api_key && filter.api_key !== 'all') params.append('api_key', filter.api_key);
        if (filter.user_id) params.append('user_id', filter.user_id);
        if (filter.execution_id) params.append('execution_id', filter.execution_id);
        if (filter.search) params.append('search', filter.search);
        if (filter.start_time) params.append('start_time', filter.start_time);
        if (filter.end_time) params.append('end_time', filter.end_time);

        const response = await apiClient.get(`${BASE_URL}/stats?${params.toString()}`);
        const items = response.data.data || [];
        
        return items.map((item: any) => ({
            ...item,
            total_cost: Number(item.total_cost || 0),
            total_tokens: Number(item.total_tokens || 0),
            total_input_tokens: Number(item.total_input_tokens || 0),
            total_completion_tokens: Number(item.total_completion_tokens || 0)
        }));
    },

    async getExchangeRates(): Promise<any> {
        const CACHE_KEY = 'exchange_rates_usd';
        const CACHE_EXPIRY_KEY = 'exchange_rates_usd_expiry';
        const TTL = 24 * 60 * 60 * 1000; // 24 hours on frontend

        const now = Date.now();
        const cached = localStorage.getItem(CACHE_KEY);
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

        if (cached && expiry && now < Number(expiry)) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(CACHE_EXPIRY_KEY);
            }
        }

        const response = await apiClient.get('/backend/api/platform/external/exchange-rates');
        const data = response.data;

        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_EXPIRY_KEY, (now + TTL).toString());

        return data;
    }
};
