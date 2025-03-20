"use client"

import { Icon } from "@iconify/react"
import { useCallback } from "react"

export type MonthData = {
  month: number
  year: number
  label: string
  fullLabel: string
}

interface MonthSelectorProps {
  visibleMonths: MonthData[]
  visibleMonthsStart: number
  allMonths: MonthData[]
  selectedMonth: number
  selectedYear: number
  onPrevMonths: () => void
  onNextMonths: () => void
  onMonthSelect: (monthData: MonthData) => void
}

export function MonthSelector({
  visibleMonths,
  visibleMonthsStart,
  allMonths,
  selectedMonth,
  selectedYear,
  onPrevMonths,
  onNextMonths,
  onMonthSelect,
}: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-2">
      <button
        onClick={onPrevMonths}
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
            onClick={() => onMonthSelect(monthData)}
          >
            {monthData.fullLabel}
          </button>
        ))}
      </div>

      <button
        onClick={onNextMonths}
        disabled={visibleMonthsStart + 3 >= allMonths.length}
        className={`p-2 rounded-full ${
          visibleMonthsStart + 3 >= allMonths.length ? "text-white/40" : "text-white hover:bg-white/10"
        }`}
      >
        <Icon icon="lucide:chevron-right" className="w-5 h-5" />
      </button>
    </div>
  )
}

export function useMonthSelector() {
  // Get current month and year
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const generateMonthsHistory = useCallback(
    (months = 24) => {
      const result: MonthData[] = []

      // Generate months of history
      for (let i = 0; i < months; i++) {
        // Calculate month and year by going backwards from current month
        const date = new Date(currentYear, currentMonth - 1 - i)
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        result.push({
          month,
          year,
          label: date.toLocaleString("default", { month: "long" }),
          fullLabel: `${date.toLocaleString("default", { month: "short" })}-${year}`,
        })
      }

      // Reverse the array so oldest months come first
      return result.reverse()
    },
    [currentMonth, currentYear],
  )

  return { currentMonth, currentYear, generateMonthsHistory }
}

