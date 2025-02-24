"use client";

import NavBar from "@/layouts/NavBar";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";

type Transaction = {
  category: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
};

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

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
      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }

      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Refresh failed");
      }

      const data = await refreshResponse.json();
      localStorage.setItem("accessToken", data.accessToken);
      // In case the backend also sends a new refresh token
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      refreshQueue.forEach(resolve => resolve(data.accessToken));
      refreshQueue = [];

      return data.accessToken;
    } catch (error) {
      handleLogout();
      throw error;
    } finally {
      isRefreshing = false;
    }
  };

  const getValidToken = async (): Promise<string> => {
    const currentToken = localStorage.getItem("accessToken");
    if (!currentToken) {
      throw new Error("No access token available");
    }

    if (isTokenExpired(currentToken)) {
      console.log("Token expired, refreshing...");
      return refreshToken();
    }

    return currentToken;
  };

  const fetchWithToken = async (url: string): Promise<Response> => {
    try {
      const token = await getValidToken();
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Try one more refresh if we get 401
        const newToken = await refreshToken();
        return fetch(url, {
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      return response;
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = today.getDate();
    const year = today.getFullYear();
    setCurrentDate(`${month}/${day}/${year}`);

    const fetchTransactions = async () => {
      try {
        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transaction`);
        
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        const formattedTransactions = data.map((tx: any) => {
          const categoryInfo = TRANSACTION_CATEGORIES[tx.categoryID] || {
            name: "Other",
            icon: <Icon icon="mdi:help-circle" width="3em" height="3em" className="text-white" />,
            color: "bg-gray",
          };

          const amount = tx.type === "EXPENSE" ? -Math.abs(Number(tx.amount)) : Math.abs(Number(tx.amount));

          return {
            category: categoryInfo.name,
            amount: amount,
            icon: categoryInfo.icon,
            color: categoryInfo.color,
          };
        });

        setTransactions(formattedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="description-medium">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="description-medium !text-red">{error}</p>
      </div>
    );
  }

  // Main page content
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-emerald-500 text-white p-4 w-full shadow-lg">
        <h1 className="sub-header text-center">Money Tracker</h1>

        <div className="flex items-center justify-center mt-3 gap-x-10">
          <div className="space-y-1">
            <div className="description-big-medium">Expenses:</div>
            <div className="description-big-medium">
              $
              {Math.abs(
                transactions.reduce((acc, curr) => (curr.amount < 0 ? acc + curr.amount : acc), 0)
              ).toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-x-6">
            <div className="space-y-1 text-center">
              <div className="description-big-medium">Income:</div>
              <div className="description-big-medium">
                $
                {transactions
                  .reduce((acc, curr) => (curr.amount > 0 ? acc + curr.amount : acc), 0)
                  .toFixed(2)}
              </div>
            </div>

            <div className="w-[2px] h-10 bg-black"></div>

            <div className="text-right">
              <div className="description-big-medium">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray">
            <Icon icon="mdi:file-search-outline" width="3em" height="3em" className="h-16 w-16 mb-4" />
            <p className="description-big-medium">No records</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-8 pr-8 w-full"
                >
                  <div className="flex items-center space-x-5">
                    <div className={`${transaction.color} p-3 rounded-full`}>{transaction.icon}</div>
                    <span className="description-medium">{transaction.category}</span>
                  </div>
                  <span
                    className={`description-medium ${transaction.amount < 0 ? "!text-red" : "!text-green"}`}
                  >
                    {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <NavBar />
      </div>
    </div>
  );
}