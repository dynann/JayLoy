"use client"

import { Icon } from "@iconify/react"
import { JSX } from "react"

// Type for transaction data
type Transaction = {
  category: string
  amount: number
  icon: JSX.Element
  color: string
}

export default function HomePage() {
  // transaction records
  const transactions: Transaction[] = [
    { category: "Food", amount: -45.0, icon: <Icon icon="fluent:food-48-regular" width="3em" height="3em" className="text-white" />, color: "bg-red" },
    { category: "Transport", amount: -25.0, icon: <Icon icon="solar:bus-bold" width="3em" height="3em" className="text-white"/>, color: "bg-purple" },
    { category: "Medicine", amount: -31.0, icon: <Icon icon="cuida:medicine-outline" width="3em" height="3em" className="text-white"/>, color: "bg-green" },
    { category: "Groceries", amount: -43.0, icon: <Icon icon="material-symbols:grocery" width="3em" className="text-white"/>, color: "bg-orange" },
    { category: "Savings", amount: 75.0, icon: <Icon icon="hugeicons:money-saving-jar" width="3em" className="text-white" />, color: "bg-cyan" },
    { category: "Rent", amount: -50.0, icon: <Icon icon="mdi:house-clock-outline" width="3em" height="3em" className="text-white" />, color: "bg-blue" },
    { category: "Gifts", amount: -45.0, icon: <Icon icon="famicons:gift-outline" width="3em" height="3em" className="text-white" />, color: "bg-purple" },
    { category: "Entertainment", amount: -35.0, icon: <Icon icon="ion:ticket-outline" width="3em" height="3em" className="text-white"/>, color: "bg-pink" },
  ]
  

  // Calculate totals
  const expenses = transactions.reduce((acc, curr) => (curr.amount < 0 ? acc + curr.amount : acc), 0)
  const income = transactions.reduce((acc, curr) => (curr.amount > 0 ? acc + curr.amount : acc), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-emerald-500 text-white p-4 space-y-4">
        <h1 className="text-xl font-semibold">Money Tracker</h1>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-sm opacity-90">Expenses</div>
            <div className="text-lg font-medium">{expenses.toFixed(2)}$</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm opacity-90">Income</div>
            <div className="text-lg font-medium">{income.toFixed(2)}$</div>
          </div>
          <div className="text-right">
            <div className="text-sm">09/1/2025</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {transactions.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Icon icon="mdi:file-search-outline" width="3em" height="3em" className="h-16 w-16 mb-4"/>
            <p className="text-lg">No records</p>
          </div>
        ) : (
          // Transactions list
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-[2rem] pr-[2rem]">
                <div className="flex items-center space-x-5">
                  <div className={`${transaction.color} p-3 rounded-full`}>{transaction.icon}</div>
                  <span className="font-medium">{transaction.category}</span>
                </div>
                <span className={`font-medium ${transaction.amount < 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {transaction.amount < 0 ? "" : "+"}
                  {transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

