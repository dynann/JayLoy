"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthFetch } from "@/hooks/useAuthFetch"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Icon } from "@iconify/react"
import NavBar from "@/layouts/NavBar"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { LoadingState } from "@/components/LoadingState"
import { ErrorState } from "@/components/ErrorState"
import dayjs from "dayjs"

type ChartData = {
  categoryID: string
  value: number
  amount: number
}

const colorMap: { [key: string]: string } = {
  red: "#DD0A0A",
  purple: "#9747FF",
  green: "#34C759",
  orange: "#FFAE4C",
  cyan: "#32ADE6",
  blue: "#304FFE",
  pink: "#FF2D55",
  primary: "#3EB075",
  brown: "#A2845E",
  gray: "#909090",
}

export default function ChartPage() {
  const { fetchWithToken, loading, error } = useAuthFetch()
  const [activeView, setActiveView] = useState<"income" | "expense">("expense")
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1)
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Format the month query using dayjs
        const monthParam = dayjs(`${selectedYear}-${selectedMonth}-01`).format('YYYY-MM')
        
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?month=${monthParam}`,
        )
        const data = await response.json()
        const transactionsData = Array.isArray(data) ? data : data.transactions || []
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        setTransactions([])
      }
    }
    fetchTransactions()
  }, [selectedMonth, selectedYear, fetchWithToken])

  const processData = useCallback((): ChartData[] => {
    const filtered = transactions.filter((t) => {
      const amt = t.type === "EXPENSE" ? -Math.abs(Number.parseFloat(t.amount)) : Math.abs(Number.parseFloat(t.amount))
      return activeView === "income" ? amt > 0 : amt < 0
    })

    const grouped = filtered.reduce(
      (acc: Record<number, ChartData>, t: any) => {
        const key = Number(t.categoryID)
        if (!acc[key]) {
          acc[key] = { categoryID: String(key), value: 0, amount: 0 }
        }
        const amt =
          t.type === "EXPENSE" ? -Math.abs(Number.parseFloat(t.amount)) : Math.abs(Number.parseFloat(t.amount))
        acc[key].value += Math.abs(amt)
        acc[key].amount += amt
        return acc
      },
      {} as Record<number, ChartData>,
    )

    const total = Object.values(grouped).reduce((sum, item) => sum + item.value, 0)

    return Object.values(grouped).map((item) => ({
      ...item,
      value: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }))
  }, [transactions, activeView])

  const currentData = processData()
  
  // using dayjs
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const getCategoryColor = useCallback((colorClass = "bg-gray") => {
    const color = colorClass.replace("bg-", "")
    return colorMap[color] || colorMap.gray
  }, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pb-6">
        <h1 className="text-xl font-semibold text-center text-white py-4">Financial Analysis</h1>

        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`px-8 py-1.5 rounded-full text-sm ${
              activeView === "income" ? "bg-white !text-primary" : "text-white border border-white"
            }`}
            onClick={() => setActiveView("income")}
          >
            Income
          </button>
          <button
            className={`px-8 py-1.5 rounded-full text-sm ${
              activeView === "expense" ? "bg-white !text-red" : "text-white border border-white"
            }`}
            onClick={() => setActiveView("expense")}
          >
            Expense
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 px-2 justify-center">
          {months.map((month) => (
            <button
              key={month}
              className={`whitespace-nowrap pb-1 ${
                selectedMonth === month ? "text-white font-medium border-b-2 border-white" : "text-white/70"
              }`}
              onClick={() => setSelectedMonth(month)}
            >
              {dayjs().month(month - 1).format('MMMM')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray">
            <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
            <p className="text-lg">No records this month</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="h-[220px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                    dataKey="value"
                  >
                    {currentData.map((entry, index) => {
                      const category = TRANSACTION_CATEGORIES[Number(entry.categoryID)]
                      return <Cell key={index} fill={getCategoryColor(category?.color)} />
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-y-4 mb-8 ml-12">
              {currentData.map((item) => {
                const category = TRANSACTION_CATEGORIES[Number(item.categoryID)]
                const colorClass = category?.color || "bg-gray"
                return (
                  <div key={item.categoryID} className="flex items-center justify-center w-full">
                    {/* Dots and Names */}
                    <div className="flex w-1/2 justify-end items-center gap-2">
                      {/* dot container */}
                      <div className="w-4 flex justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                      </div>

                      {/* name container */}
                      <div className="w-32 text-left">
                        <span className="text-sm">{category?.name || "Other"}</span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="w-1/2 flex justify-start pl-8">
                      <span className="text-sm">{item.value}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <h2 className="font-medium px-1 mb-3">{activeView === "income" ? "Income" : "Expense"} Lists:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentData.map((item) => {
                const category = TRANSACTION_CATEGORIES[Number(item.categoryID)]
                const colorClass = category?.color || "bg-gray"
                return (
                  <div
                    key={item.categoryID}
                    className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-8 pr-8 w-full"
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`${colorClass} p-3 rounded-full`}>
                        {category?.icon || <Icon icon="mdi:help-circle" className="w-[3em] h-[3em] text-white" />}
                      </div>
                      <span className="description-medium">{category?.name || "Other"}</span>
                    </div>
                    <span className={`description-medium ${activeView === "income" ? "!text-primary" : "!text-red"}`}>
                      {activeView === "income" ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <NavBar />
    </div>
  )
}