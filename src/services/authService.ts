import { apiClient } from '../api/client';
import type { User, DeviceSession, LinkedAccount, CredentialCategory } from '../models/auth';

export * from '../models/auth';

const BACKEND_URL = '/backend';

export const authService = {
    async checkAuth(): Promise<{ user: User | null; token: string | null }> {
        try {
            const response = await apiClient.get<{ user: User | null; token: string | null }>(`${BACKEND_URL}/auth/user`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch auth status', err);
            return { user: null, token: null };
        }
    },

    async refreshToken(): Promise<string | null> {
        try {
            const response = await apiClient.get<{ token: string }>(`${BACKEND_URL}/auth/refresh`, {
                withCredentials: true,
            });
            return response.data.token;
        } catch (err) {
            console.error('Failed to refresh token', err);
            return null;
        }
    },

    async getSessions(): Promise<DeviceSession[]> {
        try {
            const response = await apiClient.get<DeviceSession[]>(`${BACKEND_URL}/api/sessions`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching device sessions', err);
            return [];
        }
    },

    async getLinkedAccounts(): Promise<LinkedAccount[]> {
        try {
            const response = await apiClient.get<LinkedAccount[]>(`${BACKEND_URL}/api/linked-accounts`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching linked accounts', err);
            return [];
        }
    },

    async unlinkAccount(providerName: string): Promise<boolean> {
        try {
            const response = await apiClient.delete(`${BACKEND_URL}/api/linked-accounts/${providerName}`, {
                withCredentials: true,
            });
            return response.status === 204;
        } catch (err) {
            console.error(`Error unlinking account ${providerName}`, err);
            const message = err instanceof Error ? err.message : 'Failed to unlink account';
            throw new Error((err as any)?.response?.data?.error || message);
        }
    },

    async getCredentials(): Promise<CredentialCategory[]> {
        try {
            const response = await apiClient.get<CredentialCategory[]>(`${BACKEND_URL}/api/credentials`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching credentials', err);
            return [];
        }
    },

    login(idp: string = '') {
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/login${idp ? `?idp=${idp}` : ''}`;
    },

    register() {
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/login?action=register`;
    },

    logout() {
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/logout`;
    }
};
