import { apiClient } from '../api/client';

export interface BalanceResponse {
    balance: number;
    status: string;
}

export const billingService = {
    async getBalance(): Promise<BalanceResponse> {
        const response = await apiClient.get('/backend/api/billing/balance');
        return response.data;
    }
};
