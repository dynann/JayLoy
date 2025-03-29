"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { useCallback, useMemo } from "react"
import { formatCurrency } from "@/utils/formatCurrency"

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

  const animatedData = useMemo(() => {
    if (chartData.length === 1) {
      return [
        {
          ...chartData[0],
          value: 100 
        },
        {
          categoryID: "invisible",
          value: 0,
          amount: 0,
          name: "",
        }
      ]
    }
    return chartData
  }, [chartData])

  return (
      <div className="relative h-[220px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={animatedData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
              dataKey="value"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
              cursor="default"
              activeIndex={undefined}
          >
            {animatedData.map((entry, index) => {
              if (entry.categoryID === "invisible") {
                return <Cell key={index} fill="transparent" style={{ pointerEvents: "none" }} />
              }
              const category = TRANSACTION_CATEGORIES[Number(entry.categoryID)]
              return (
                <Cell 
                  key={index} 
                  fill={getCategoryColor(category?.color)}
                  style={{ pointerEvents: "none" }}
                />
              )
            })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* total amount */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm text-gray-500 font-medium">Total</p>
          <p className={`text-2xl font-bold ${activeView === "income" ? "text-primary" : "text-red"}`}>
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
  )
}

