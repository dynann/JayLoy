import { useState, useCallback, useRef } from 'react';

// Moved outside to prevent recreation on every render
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    const payload = JSON.parse(jsonPayload);
    return Date.now() >= (payload.exp * 1000);
  } catch {
    return true;
  }
};

export const useAuthFetch = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const isRefreshing = useRef(false);
  const refreshQueue = useRef<((token: string) => void)[]>([]);

  const refreshToken = useCallback(async (): Promise<string> => {
    if (isRefreshing.current) {
      return new Promise((resolve) => {
        refreshQueue.current.push(resolve);
      });
    }

    isRefreshing.current = true;
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) throw new Error("No refresh token available");

      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!refreshResponse.ok) throw new Error("Refresh failed");
      const data = await refreshResponse.json();

      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      refreshQueue.current.forEach(resolve => resolve(data.accessToken));
      refreshQueue.current = [];
      return data.accessToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw error;
    } finally {
      isRefreshing.current = false;
    }
  }, []);

  const fetchWithToken = useCallback(async (url: string): Promise<Response> => {
    try {
      setLoading(true);
      let token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token available");

      if (isTokenExpired(token)) {
        token = await refreshToken();
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        return fetch(url, { headers: { Authorization: `Bearer ${newToken}` } });
      }

      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Request failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  return { fetchWithToken, loading, setLoading, error, setError };
};