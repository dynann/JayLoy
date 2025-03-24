"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthFetch } from "@/hooks/useAuthFetch"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Icon } from "@iconify/react"
import NavBar from "@/layouts/NavBar"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { LoadingState } from "@/components/LoadingState"
import { ErrorState } from "@/components/ErrorState"
import { CategoryTransactions } from "@/components/category-transactions"
import { Transaction } from "@/type/transaction"

type CategorySummary = {
  categoryId: number
  name: string
  type: string
  amount: string
  percentage: number
}

type SummaryResponse = {
  data: CategorySummary[]
  pagination: {
    totalItems: number
    currentPage: number
    totalPages: number
    itemsPerPage: number
  }
  totals: {
    income: string
    expense: string
    net: string
  }
}

type ChartData = {
  categoryID: string
  value: number
  amount: number
  name: string
}

type MonthData = {
  month: number
  year: number
  label: string
  fullLabel: string
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
  const { fetchWithToken, loading: fetchLoading, error: fetchError } = useAuthFetch()
  const [activeView, setActiveView] = useState<"income" | "expense">("expense")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categorySummary, setCategorySummary] = useState<SummaryResponse | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showAllLegend, setShowAllLegend] = useState(false)
  const [visibleMonthsStart, setVisibleMonthsStart] = useState(0)
  const [allMonths, setAllMonths] = useState<MonthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current month and year
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Create array of all available months (going back 24 months from current)
  useEffect(() => {
    const months: MonthData[] = []

    // Generate 24 months of history (2 years)
    for (let i = 0; i < 24; i++) {
      // Calculate month and year by going backwards from current month
      const date = new Date(currentYear, currentMonth - 1 - i)
      const month = date.getMonth() + 1
      const year = date.getFullYear()

      months.push({
        month,
        year,
        label: date.toLocaleString("default", { month: "long" }),
        fullLabel: `${date.toLocaleString("default", { month: "short" })}-${year}`,
      })
    }

    // Reverse the array so oldest months come first
    months.reverse()
    setAllMonths(months)

    // Initialize to show current month and 2 previous months
    setVisibleMonthsStart(Math.max(0, months.length - 3))
  }, [currentMonth, currentYear])

  // Get the currently visible months (3)
  const visibleMonths = allMonths.slice(visibleMonthsStart, visibleMonthsStart + 3)

  // Handle pagination
  const handlePrevMonths = () => {
    if (visibleMonthsStart > 0) {
      setVisibleMonthsStart(visibleMonthsStart - 1)
    }
  }

  const handleNextMonths = () => {
    if (visibleMonthsStart + 3 < allMonths.length) {
      setVisibleMonthsStart(visibleMonthsStart + 1)
    }
  }

  // Handle month selection
  const handleMonthSelect = (monthData: MonthData) => {
    setSelectedMonth(monthData.month)
    setSelectedYear(monthData.year)

    // Find the position of the selected month in the available months array
    const selectedMonthPosition = allMonths.findIndex((m) => m.month === monthData.month && m.year === monthData.year)

    // If clicking on the leftmost visible month (first in the visible array)
    if (selectedMonthPosition === visibleMonthsStart) {
      // Show two months before the selected month
      const newStartPosition = Math.max(0, selectedMonthPosition - 2)
      setVisibleMonthsStart(newStartPosition)
    }
    // If clicking on any other month, center the view around it
    else {
      // Calculate the start position to show the selected month and two previous months
      let newStartPosition = Math.max(0, selectedMonthPosition - 2)

      // Ensure we don't exceed the available months
      if (newStartPosition + 3 > allMonths.length) {
        newStartPosition = Math.max(0, allMonths.length - 3)
      }

      setVisibleMonthsStart(newStartPosition)
    }
  }

  // Fetch transactions for the CategoryTransactions component
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Format the month query using the selected year and month
        const monthParam = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`

        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/transactions?month=${monthParam}`)
        const data = await response.json()
        const transactionsData = Array.isArray(data) ? data : data.transactions || []
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        setTransactions([])
      }
    }
    fetchTransactions()
  }, [selectedMonth, fetchWithToken, selectedYear])

  // Fetch category summary from backend
  useEffect(() => {
    const fetchCategorySummary = async () => {
      setLoading(true)
      setError(null)

      try {
        // Format the month query using the selected year and month
        const monthParam = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
        const type = activeView.toUpperCase()

        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/summary?type=${type}&month=${monthParam}&limit=100`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch category summary: ${response.status}`)
        }

        const data = await response.json()
        setCategorySummary(data)
      } catch (err) {
        console.error("Failed to fetch category summary:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch category summary")
        setCategorySummary(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategorySummary()
  }, [selectedMonth, selectedYear, activeView, fetchWithToken])

  // Use backend data directly for chart
  const chartData: ChartData[] =
    categorySummary?.data.map((item) => ({
      categoryID: String(item.categoryId),
      value: item.percentage,
      amount: Number(item.amount) / 100, // Convert cents to dollars for display
      name: item.name,
    })) || []

  // Get total amount from backend
  const totalAmount = categorySummary
    ? Number(activeView === "income" ? categorySummary.totals.income : categorySummary.totals.expense) / 100
    : 0

  // Sort data by value (percentage) for legend display
  const sortedData = [...chartData].sort((a, b) => b.value - a.value)

  // Get top 3 for legend display
  const topLegendItems = sortedData.slice(0, 3)
  const legendItems = showAllLegend ? sortedData : topLegendItems

  const getCategoryColor = useCallback((colorClass = "bg-gray") => {
    const color = colorClass.replace("bg-", "")
    return colorMap[color] || colorMap.gray
  }, [])

  if (loading || fetchLoading) return <LoadingState />
  if (error || fetchError) return <ErrorState message={error || fetchError || "An error occurred"} />

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

        {/* Month Pagination */}
        <div className="flex items-center justify-center gap-2 px-2">
          <button
            onClick={handlePrevMonths}
            disabled={visibleMonthsStart === 0}
            className={`p-2 rounded-full ${visibleMonthsStart === 0 ? "text-white/40" : "text-white hover:bg-white/10"}`}
          >
            <Icon icon="lucide:chevron-left" className="w-5 h-5" />
          </button>

          <div className="flex gap-4">
            {visibleMonths.map((monthData) => (
              <button
                key={`${monthData.year}-${monthData.month}`}
                className={`whitespace-nowrap pb-1 px-2 ${
                  selectedMonth === monthData.month && selectedYear === monthData.year
                    ? "text-white font-medium border-b-2 border-white"
                    : "text-white/70"
                }`}
                onClick={() => handleMonthSelect(monthData)}
              >
                {monthData.fullLabel}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextMonths}
            disabled={visibleMonthsStart + 3 >= allMonths.length}
            className={`p-2 rounded-full ${visibleMonthsStart + 3 >= allMonths.length ? "text-white/40" : "text-white hover:bg-white/10"}`}
          >
            <Icon icon="lucide:chevron-right" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray">
            <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
            <p className="text-lg">No records this month</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Chart Title */}
            <h2 className="text-2xl font-bold text-center mb-4">
              {activeView === "income" ? "Income" : "Expense"} Summary
            </h2>

            <div className="relative h-[220px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => {
                      const category = TRANSACTION_CATEGORIES[Number(entry.categoryID)]
                      return <Cell key={index} fill={getCategoryColor(category?.color)} />
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Total Amount */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-sm text-gray-500 font-medium">Total</p>
                <p className={`text-2xl font-bold ${activeView === "income" ? "text-primary" : "text-red"}`}>
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-y-4 mb-2 ml-12">
              {legendItems.map((item) => {
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
                        <span className="text-sm font-medium">{item.name || category?.name || "Other"}</span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="w-1/2 flex justify-start pl-8">
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  </div>
                )
              })}

              {/* See More Button */}
              {chartData.length > 3 && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => setShowAllLegend(!showAllLegend)}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {showAllLegend ? "Show Less" : "See More"}
                  </button>
                </div>
              )}
            </div>

            <h2 className="font-bold text-xl px-1 mb-4 mt-6">
              {activeView === "income" ? "Income" : "Expense"} Lists:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chartData.map((item) => {
                const category = TRANSACTION_CATEGORIES[Number(item.categoryID)]
                const colorClass = category?.color || "bg-gray"
                return (
                  <div
                    key={item.categoryID}
                    className="flex items-center justify-between bg-white rounded-full p-3 shadow-sm pl-8 pr-8 w-full cursor-pointer hover:opacity-80 transition-all"
                    onClick={() => setSelectedCategory(Number(item.categoryID))}
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`${colorClass} p-3 rounded-full`}>
                        {category?.icon || <Icon icon="mdi:help-circle" className="w-[3em] h-[3em] text-white" />}
                      </div>
                      <span className="description-medium">{item.name || category?.name || "Other"}</span>
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

      {selectedCategory !== null && (
        <CategoryTransactions
          categoryId={selectedCategory}
          transactions={transactions}
          onClose={() => setSelectedCategory(null)}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

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

