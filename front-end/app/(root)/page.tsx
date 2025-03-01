"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuthFetch } from "@/hooks/useAuthFetch"
import { Header } from "@/components/Header"
import { TransactionItem } from "@/components/TransactionItem"
import { TransactionDetail } from "@/components/categoryTransaction-detail"
import { LoadingState } from "@/components/LoadingState"
import { ErrorState } from "@/components/ErrorState"
import NavBar from "@/layouts/NavBar"
import { Icon } from "@iconify/react"
import dayjs from "dayjs"

export default function HomePage() {
  const { fetchWithToken, loading, setLoading, error } = useAuthFetch()
  const [transactions, setTransactions] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  // today's date in YYYY-MM-DD format using dayjs
  const getFormattedDate = useCallback(() => {
    return dayjs().format("YYYY-MM-DD")
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const formattedDate = getFormattedDate()
        setCurrentDate(formattedDate)

        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/transactions?date=${formattedDate}`)
        const data = await response.json()
        const transactionsData = Array.isArray(data) ? data : data.transactions || []
        setTransactions(transactionsData)
      } catch (err) {
        console.error("Error fetching transactions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [fetchWithToken, getFormattedDate, setLoading])

  // Calculate total income and expense
  const { totalIncome, totalExpense } = transactions.reduce(
    (totals, transaction) => {
      const amount = Number.parseFloat(transaction.amount)
      if (transaction.type === "EXPENSE") {
        totals.totalExpense += amount
      } else {
        totals.totalIncome += amount
      }
      return totals
    },
    { totalIncome: 0, totalExpense: 0 },
  )

  const handleEdit = async () => {
    // edit functionality
    console.log("Edit transaction:", selectedTransaction)
  }

  const handleDelete = async () => {
    try {
      await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${selectedTransaction.id}`, {
        method: "DELETE",
      })

      // Refresh transactions after delete
      const formattedDate = getFormattedDate()
      const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/transactions?date=${formattedDate}`)
      const data = await response.json()
      const transactionsData = Array.isArray(data) ? data : data.transactions || []
      setTransactions(transactionsData)
      setSelectedTransaction(null)
    } catch (err) {
      console.error("Error deleting transaction:", err)
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header title="Money Tracker" income={totalIncome} expense={totalExpense} date={currentDate} />

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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Navigation Bar */}
      <NavBar />
    </div>
  )
}

