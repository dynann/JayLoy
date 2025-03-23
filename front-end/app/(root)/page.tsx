"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Header } from "@/components/Header";
import { TransactionItem } from "@/components/TransactionItem";
import { TransactionDetail } from "@/components/categoryTransaction-detail";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import NavBar from "@/layouts/NavBar";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { fetchWithToken, loading, setLoading, error } = useAuthFetch();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchTransactions = useCallback(
    async (dateToFetch: string) => {
      try {
        setLoading(true);
        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/transactions?date=${dateToFetch}`);
        const data = await response.json();
        console.log("API transaction response:", data);
        const transactionsData = Array.isArray(data) ? data : data.transactions || [];
        setTransactions(transactionsData.reverse());
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchWithToken, setLoading]
  );

  useEffect(() => {
    fetchTransactions(currentDate)
  }, [fetchTransactions, currentDate])

  useEffect(() => {
    console.log("Transactions loaded:", transactions);
    // Check if any transactions have imageUrl
    const hasImages = transactions.some(t => t.imageUrl);
    console.log("Any transactions with images:", hasImages);
  }, [transactions]);

  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate)
    fetchTransactions(newDate)
  }

  // Calculate total income and expense
  const { totalIncome, totalExpense } = transactions.reduce(
    (totals, transaction) => {
      // Convert from cents to dollars by dividing by 100
      const amount = Number.parseFloat(transaction.amount) / 100
      if (transaction.type === "EXPENSE") {
        totals.totalExpense += amount;
      } else {
        totals.totalIncome += amount;
      }
      return totals;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const handleDelete = async () => {
    if (!selectedTransaction || isDeleting) return;

    try {
      setIsDeleting(true);

      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${selectedTransaction.id}`,
        {
          method: "DELETE",
        }
      );

      // Check if the request was successful (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Update local state by filtering out the deleted transaction
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== selectedTransaction.id),
        )

        // Close the modal
        setSelectedTransaction(null);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const isToday = dayjs(currentDate).isSame(dayjs(), "day")
  const dateDisplay = isToday ? "today" : dayjs(currentDate).format("YYYY-MM-DD")

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <Header
        title="Money Tracker"
        income={totalIncome}
        expense={totalExpense}
        date={currentDate}
        onDateChange={handleDateChange}
      />

      {/* Transaction List */}
      <div className="p-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 pb-24  text-gray-500">
            <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
            <p className="description-big-medium">No records for {dateDisplay}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-1">
            {/* box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => setSelectedTransaction(transaction)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onEdit={() => {
            localStorage.setItem("editingTransaction", JSON.stringify(selectedTransaction));
            router.push(`/transaction?edit=true`);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Navigation Bar */}
      <NavBar />
    </div>
  );
}

