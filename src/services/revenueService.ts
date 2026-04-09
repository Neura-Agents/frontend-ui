import { apiClient } from '../api/client';

export interface Transaction {
    id: string;
    user_id: string;
    user_name: string;
    user_email?: string;
    amount: number;      // Native currency amount
    amount_usd: number;  // USD equivalent
    currency: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    type: string;
    payment_method: string;
    created_at: string;
}

export interface RevenueStats {
    date: string;
    revenue: number;
    transactions: number;
    profit: number;
}

export interface RevenueInsights {
    peak_revenue_day: string;
    total_volume: number;
    growth_rate: number;
    top_payment_method: string;
}

export const revenueService = {
    getTransactions: async (params: { page: number; limit: number; search?: string; startDate?: string; endDate?: string }): Promise<{ items: Transaction[]; total: number }> => {
        const offset = (params.page - 1) * params.limit;
        const response = await apiClient.get('/backend/api/revenue/admin/transactions', {
            params: {
                limit: params.limit,
                offset,
                search: params.search,
                from: params.startDate,
                to: params.endDate
            }
        });
        return {
            items: response.data.transactions,
            total: response.data.total
        };
    },

    getRevenueStats: async (params: { startDate?: string; endDate?: string }): Promise<RevenueStats[]> => {
        const response = await apiClient.get('/backend/api/revenue/admin/stats', {
            params: {
                from: params.startDate,
                to: params.endDate
            }
        });
        return response.data;
    },

    getInsights: async (params: { startDate?: string; endDate?: string }): Promise<RevenueInsights> => {
        const response = await apiClient.get('/backend/api/revenue/admin/insights', {
            params: {
                from: params.startDate,
                to: params.endDate
            }
        });
        return response.data;
    }
};
