"use client";
import { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Header } from "@/components/Header";
import { TransactionItem } from "@/components/TransactionItem";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import NavBar from "@/layouts/NavBar";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

export default function HomePage() {
  const { fetchWithToken, loading, setLoading, error } = useAuthFetch();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  // today's date in YYYY-MM-DD format using dayjs
  const getFormattedDate = () => {
    return dayjs().format("YYYY-MM-DD");
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const formattedDate = getFormattedDate();
        setCurrentDate(formattedDate);

        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?date=${formattedDate}`
        );
        const data = await response.json();
        const transactionsData = Array.isArray(data)
          ? data
          : data.transactions || [];
        setTransactions(transactionsData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch once when the component mounts
    fetchTransactions();
  }, []); // Empty dependency array ensures it only runs once

  // Calculate total income and expense
  const { totalIncome, totalExpense } = transactions.reduce(
    (totals, transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === "EXPENSE") {
        totals.totalExpense += amount;
      } else {
        totals.totalIncome += amount;
      }
      return totals;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        title="Money Tracker"
        income={totalIncome}
        expense={totalExpense}
        date={currentDate}
      />

      {/* Transaction List */}
      <div className="p-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
            <p className="description-big-medium">No records today</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transactions.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  transaction={{
                    ...transaction,
                    formattedAmount:
                      transaction.type === "EXPENSE"
                        ? `- ${transaction.amount}`
                        : `+ ${transaction.amount}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <NavBar />
    </div>
  );
}