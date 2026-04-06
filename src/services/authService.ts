import { apiClient } from '../api/client';
import type { User, DeviceSession, LinkedAccount, CredentialCategory } from '../models/auth';

export * from '../models/auth';

const BACKEND_URL = '/backend';

import { themes } from '../theme/themes';

const KONG_URL = import.meta.env.VITE_KONG_URL || 'http://localhost:8000';
export const authService = {
    async checkAuth(): Promise<{ user: User | null; token: string | null }> {
        try {
            // Add cache-busting query param and headers to prevent stale browser cache on back navigation
            const response = await apiClient.get<{ user: User | null; token: string | null }>(`${BACKEND_URL}/auth/user?t=${Date.now()}`, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
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

        const currentThemeId = localStorage.getItem('neura-theme') || 'dark';
        const themeConfig = themes.find(t => t.id === currentThemeId) || themes.find(t => t.className === currentThemeId);
        const themeClass = themeConfig ? themeConfig.className : currentThemeId;
        params.append('theme', themeClass);

        // Determine where to land after login
        // In local dev, we replace 7999 with 8005.
        // In production, we use VITE_DASHBOARD_URL if available.
        const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';
        const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || window.location.origin.replace(':7999', ':8005');
        
        const origin = (APP_MODE === 'public') ? dashboardUrl : window.location.origin;

        if (redirectTo) params.append('redirect_to', `${origin}${redirectTo}`);

        const queryString = params.toString();
        window.location.href = `${KONG_URL}${BACKEND_URL}/auth/login${queryString ? `?${queryString}` : ''}`;
    },

    register() {
        const params = new URLSearchParams();
        params.append('action', 'register');

        const currentThemeId = localStorage.getItem('neura-theme') || 'dark';
        const themeConfig = themes.find(t => t.id === currentThemeId) || themes.find(t => t.className === currentThemeId);
        const themeClass = themeConfig ? themeConfig.className : currentThemeId;
        params.append('theme', themeClass);

        const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';
        const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || window.location.origin.replace(':7999', ':8005');

        const origin = (APP_MODE === 'public') ? dashboardUrl : window.location.origin;
        params.append('redirect_to', origin);

        const queryString = params.toString();
        window.location.href = `${KONG_URL}${BACKEND_URL}/auth/login${queryString ? `?${queryString}` : ''}`;
    },

    logout(redirectTo: string = window.location.pathname + window.location.search) {
        const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || 'dashboard';
        const landingUrl = import.meta.env.VITE_LANDING_URL || window.location.origin.replace(':8005', ':7999');

        const origin = (APP_MODE === 'dashboard') ? landingUrl : window.location.origin;

        const currentThemeId = localStorage.getItem('neura-theme') || 'dark';
        const themeConfig = themes.find(t => t.id === currentThemeId) || themes.find(t => t.className === currentThemeId);
        const themeClass = themeConfig ? themeConfig.className : currentThemeId;
        
        window.location.href = `${KONG_URL}${BACKEND_URL}/auth/logout?redirect_to=${origin}${redirectTo}&theme=${themeClass}`;
    }
};
