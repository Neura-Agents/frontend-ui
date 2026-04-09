import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * UmamiAnalytics component
 * 
 * Automatically injects the Umami tracking script into the document head
 * if the environment variables are correctly configured.
 * 
 * Also handles user identification for the dashboard.
 */
const UmamiAnalytics: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const appMode = import.meta.env.VITE_APP_MODE || 'dashboard';

  // Inject tracking script
  useEffect(() => {
    const umamiUrl = import.meta.env.VITE_UMAMI_URL;
    const appMode = import.meta.env.VITE_APP_MODE || 'dashboard';

    // In Dashboard mode, we WAIT for the user ID to be available before loading the script
    if (appMode === 'dashboard') {
      if (loading || !user?.id) return;
    }

    const websiteId = appMode === 'public' 
      ? import.meta.env.VITE_UMAMI_PUBLIC_ID 
      : import.meta.env.VITE_UMAMI_DASHBOARD_ID;

    const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';

    if (!enableAnalytics || !umamiUrl || !websiteId) {
      if (!enableAnalytics && umamiUrl && websiteId) {
        console.debug('[Umami] Analytics disabled via VITE_ENABLE_ANALYTICS');
      }
      return;
    }

    // Remove existing script if user changed (to force a fresh session)
    const existingScript = document.querySelector('script[id="umami-script"]');
    if (existingScript) {
      existingScript.remove();
      // Also clear the tracker's internal cache
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('umami')) {
          localStorage.removeItem(key);
        }
      }
    }

    const script = document.createElement('script');
    script.id = 'umami-script';
    script.async = true;
    script.defer = true;
    script.src = `${umamiUrl}/script.js`;
    script.setAttribute('data-website-id', websiteId);
    
    // ATTACH THE USER ID DIRECTLY TO THE TRACKER
    if (appMode === 'dashboard' && user?.id) {
       console.debug(`[Umami] Loading tracker with User ID: ${user.id}`);
       script.setAttribute('data-user-id', user.id);
       
       // Manual identification for richer metadata
       script.onload = () => {
         if ((window as any).umami) {
           (window as any).umami.identify({
             email: user.email,
             username: user.preferred_username,
             name: `${user.given_name || ''} ${user.family_name || ''}`.trim()
           });
         }
       };
    }
    
    document.head.appendChild(script);
  }, [appMode, user?.id, loading]);

  // We don't need the separate identify effect anymore because 
  // the ID is now baked into the script loading itself!

  return <>{children}</>;
};

export default UmamiAnalytics;
