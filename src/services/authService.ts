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
            const response = await apiClient.get<DeviceSession[]>(`${BACKEND_URL}/api/users/sessions`, {
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
            const response = await apiClient.get<LinkedAccount[]>(`${BACKEND_URL}/api/users/linked-accounts`, {
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
            const response = await apiClient.delete(`${BACKEND_URL}/api/users/linked-accounts/${providerName}`, {
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
            const response = await apiClient.get<CredentialCategory[]>(`${BACKEND_URL}/api/users/credentials`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching credentials', err);
            return [];
        }
    },

    async getSecureData(): Promise<any> {
        try {
            const response = await apiClient.get(`${BACKEND_URL}/api/users/secure-data`, {
                withCredentials: true,
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching secure data', err);
            return null;
        }
    },

    login(idp: string = '', redirectTo: string = window.location.pathname + window.location.search) {
        const params = new URLSearchParams();
        if (idp) params.append('idp', idp);
        if (redirectTo) params.append('redirect_to', `${window.location.origin}${redirectTo}`);

        const queryString = params.toString();
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/login${queryString ? `?${queryString}` : ''}`;
    },

    register() {
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/login?action=register`;
    },

    logout(redirectTo: string = window.location.pathname + window.location.search) {
        window.location.href = `http://localhost:8000${BACKEND_URL}/auth/logout${redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : ''}`;
    }
};
