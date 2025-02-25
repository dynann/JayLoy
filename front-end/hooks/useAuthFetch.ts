import { useState, useEffect } from 'react';

export const useAuthFetch = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let isRefreshing = false;
  let refreshQueue: ((token: string) => void)[] = [];

  const isTokenExpired = (token: string): boolean => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return Date.now() >= (payload.exp * 1000);
    } catch {
      return true;
    }
  };

  const refreshToken = async (): Promise<string> => {
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(resolve);
      });
    }

    isRefreshing = true;
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

      refreshQueue.forEach(resolve => resolve(data.accessToken));
      refreshQueue = [];
      return data.accessToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw error;
    } finally {
      isRefreshing = false;
    }
  };

  const fetchWithToken = async (url: string): Promise<Response> => {
    try {
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
    }
  };

  return { fetchWithToken, loading, setLoading, error, setError };
};