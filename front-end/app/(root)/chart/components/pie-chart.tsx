"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { useCallback } from "react"

export type ChartData = {
  categoryID: string
  value: number
  amount: number
  name: string
}

interface PieChartDisplayProps {
  chartData: ChartData[]
  totalAmount: number
  activeView: "income" | "expense"
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

export function PieChartDisplay({ chartData, totalAmount, activeView }: PieChartDisplayProps) {
  const getCategoryColor = useCallback((colorClass = "bg-gray") => {
    const color = colorClass.replace("bg-", "")
    return colorMap[color] || colorMap.gray
  }, [])

  return (
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
  )
}

