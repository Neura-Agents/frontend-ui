import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to interact with Umami Analytics.
 * 
 * Umami is loaded globally via the UmamiAnalytics component.
 * This hook provides a type-safe and convenient way to track events.
 */
export const useUmami = () => {
  const { user } = useAuth();
  const appMode = import.meta.env.VITE_APP_MODE || 'dashboard';

  /**
   * Track a custom event.
   * 
   * @param eventName Name of the event (e.g., 'button-click', 'agent-created')
   * @param eventData Optional metadata for the event
   */
  const track = useCallback((eventName: string, eventData?: Record<string, any>) => {
    // @ts-ignore
    if (window.umami && typeof window.umami.track === 'function') {
      try {
        const payload = {
          ...eventData,
          app_mode: appMode,
          // Include user ID if available for correlation even in non-dashboard mode if needed
          // though Umami usually handles this via the script tag identifier
          user_id: user?.id
        };
        
        // @ts-ignore
        window.umami.track(eventName, payload);
        console.debug(`[Umami] Track Event: ${eventName}`, payload);
      } catch (error) {
        console.error('[Umami] Tracking error:', error);
      }
    }
  }, [user?.id, appMode]);

  /**
   * Identify the current user with additional metadata.
   * 
   * @param userData User properties to track
   */
  const identify = useCallback((userData?: Record<string, any>) => {
    // @ts-ignore
    if (window.umami && typeof window.umami.identify === 'function' && user?.id) {
      try {
        const properties = {
          email: user.email,
          username: user.preferred_username,
          name: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
          ...userData
        };
        
        // @ts-ignore
        window.umami.identify(properties);
        console.debug('[Umami] Identify User:', properties);
      } catch (error) {
        console.error('[Umami] Identification error:', error);
      }
    }
  }, [user]);

  return {
    track,
    identify,
    isAvailable: !!(window as any).umami
  };
};
