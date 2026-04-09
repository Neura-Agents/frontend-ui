import { apiClient } from '../api/client';

export interface BalanceResponse {
    balance: number;
    status: string;
}

export const billingService = {
    async getBalance(): Promise<BalanceResponse> {
        const response = await apiClient.get('/backend/api/billing/balance');
        return response.data;
    },

    async createRazorpayOrder(data: { credits?: number; amount?: number }) {
        const response = await apiClient.post('/backend/api/billing/razorpay/create-order', data);
        return response.data;
    },

    async verifyRazorpayPayment(paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        amount: number;
    }) {
        const response = await apiClient.post('/backend/api/billing/razorpay/verify', paymentData);
        return response.data;
    },
    async getTransactions(params: { limit: number; offset: number; type?: string }) {
        const response = await apiClient.get('/backend/api/billing/transactions', { params });
        return response.data;
    }
};
