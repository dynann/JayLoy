"use client"

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import dayjs from "dayjs"
import { formatCurrency } from "@/utils/formatCurrency"

interface Transaction {
  id: string
  amount: number
  type: "EXPENSE" | "INCOME"
  categoryID: number
  date: string
  description?: string
}

interface CategoryTransactionsProps {
  categoryId: number
  transactions: Transaction[]
  onClose: () => void
  month: number
  year: number
}

export function CategoryTransactions({ categoryId, transactions, onClose, month, year }: CategoryTransactionsProps) {
  const [groupedTransactions, setGroupedTransactions] = useState<{ [key: string]: Transaction[] }>({})
  const category = TRANSACTION_CATEGORIES[categoryId]

  useEffect(() => {
    // Filter transactions for selected category and group by date
    const filtered = transactions.filter(
      (t) =>
        Number(t.categoryID) === categoryId && dayjs(t.date).month() + 1 === month && dayjs(t.date).year() === year,
    )

    const grouped = filtered.reduce(
      (acc, transaction) => {
        const date = dayjs(transaction.date).format("YYYY-MM-DD")
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(transaction)
        return acc
      },
      {} as { [key: string]: Transaction[] },
    )

    // Sort dates in descending order
    const sortedGrouped = Object.entries(grouped)
      .sort(([dateA], [dateB]) => dayjs(dateB).valueOf() - dayjs(dateA).valueOf())
      .reduce(
        (acc, [date, trans]) => {
          acc[date] = trans
          return acc
        },
        {} as { [key: string]: Transaction[] },
      )

    setGroupedTransactions(sortedGrouped)
  }, [transactions, categoryId, month, year])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <TabWithCancelButton text="Record Details" onClick={onClose} />
      </div>

      {/* Transaction List Container */}
      <div className="flex-1 overflow-y-auto pt-16 pb-8">
        <div className="max-w-4xl mx-auto p-4">
          {/* Category Header */}
          <div className="flex items-center space-x-5 mb-6 px-8 mt-2">
            <div className={`${category?.color || "bg-gray"} p-1 rounded-lg`}>
              {category?.icon || <Icon icon="mdi:help-circle" className="w-[3em] h-[3em] text-white" />}
            </div>
            <span className="text-lg font-medium">{category?.name || "Category"}</span>
          </div>

          {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date} className="mb-4">
              <div className="text-sm mb-2">{dayjs(date).format("YYYY-MM-DD")}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dateTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm pl-8 pr-8 w-full"
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`${category?.color || "bg-gray"} p-1 rounded-lg`}>
                        {category?.icon || <Icon icon="mdi:help-circle" className="w-[3em] h-[3em] text-white" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="description-medium">{category?.name}</span>
                        {transaction.description && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Note: </span>
                            {transaction.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className={`description-medium ${transaction.type === "EXPENSE" ? "!text-red" : "!text-primary"}`}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}
                      {formatCurrency(Math.abs(Number(transaction.amount) / 100), 2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

