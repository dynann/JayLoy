import { Transaction } from "./route";

// Helper function to handle API requests
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No token was found");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return response.json();
}

// Specific API functions for transactions
export const transactionApi = {
  // Get all transactions with optional filtering
  getTransactions: (filters?: {
    date?: string;
    month?: string;
    categoryID?: number;
    type?: "EXPENSE" | "INCOME";
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.date) queryParams.append("date", filters.date);
    if (filters?.month) queryParams.append("month", filters.month);
    if (filters?.categoryID) queryParams.append("categoryID", String(filters.categoryID));
    if (filters?.type) queryParams.append("type", filters.type);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    
    return request<Transaction[]>(`/api/transactions${queryString}`);
  },

  // Get a specific transaction by ID
  getTransaction: (id: string) => 
    request<Transaction>(`/api/transactions/${id}`),

  // Create a new transaction
  createTransaction: (transaction: Omit<Transaction, "id">) =>
    request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),

  // Update an existing transaction
  updateTransaction: (id: string, transaction: Partial<Transaction>) =>
    request<Transaction>(`/api/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transaction),
    }),

  // Delete a transaction
  deleteTransaction: (id: string) =>
    request<void>(`/api/transactions/${id}`, {
      method: "DELETE",
    }),
    
  // Get transactions by category
  getTransactionsByCategory: (categoryID: number, month?: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("categoryID", String(categoryID));
    if (month) queryParams.append("month", month);
    
    return request<Transaction[]>(`/api/transactions?${queryParams.toString()}`);
  },

  // Get transactions summary grouped by category
  getTransactionsSummary: (month: string, type: "EXPENSE" | "INCOME") => {
    const queryParams = new URLSearchParams();
    queryParams.append("month", month);
    queryParams.append("type", type);
    
    return request<any>(`/api/categories/summary?${queryParams.toString()}`);
  }
}; 