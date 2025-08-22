// client/src/hooks/useServerHealth.js
import { useState, useEffect } from 'react';

export const useServerHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  // Use environment variable or fallback to production URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://forever-server-p95j.onrender.com/api';

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout for Render

        const response = await fetch(`${API_BASE_URL}/health`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setIsHealthy(true);
          setLastChecked(new Date());
          console.log('✅ Server health check passed:', data);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⏰ Health check timeout - server may be sleeping');
        } else if (error.message.includes('CORS')) {
          console.warn('🔒 CORS error - check server configuration');
        } else {
          console.warn('⚠️ Health check failed:', error.message);
        }
        setIsHealthy(false);
        setLastChecked(new Date());
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check with longer delay for Render cold starts
    const initialTimeout = setTimeout(() => {
      checkServerHealth();
    }, 3000);

    // Check every 60 seconds for deployed apps
    const interval = setInterval(checkServerHealth, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [API_BASE_URL]);

  return { isHealthy, isLoading, lastChecked };
};