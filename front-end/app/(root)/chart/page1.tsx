"use client"

import { JSX, useState } from "react"
import { FileSearch, Utensils, Bus, ShoppingBasket, Home, Wifi, Camera, Briefcase } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

type CategoryData = {
  name: string
  value: number
  amount: number
  color: string
  icon: JSX.Element
}

export default function ChartPage() {
  const [activeView, setActiveView] = useState<"income" | "expense">("expense")
  const [selectedMonth, setSelectedMonth] = useState("This Month")

  const months = ["February", "March", "April", "This Month"]

  const expenseData: CategoryData[] = [
    { name: "Food", value: 30, amount: -45.0, color: "#FF0000", icon: <Utensils className="h-6 w-6 text-white" /> },
    {
      name: "Transportation",
      value: 25,
      amount: -45.0,
      color: "#8A2BE2",
      icon: <Bus className="h-6 w-6 text-white" />,
    },
    {
      name: "Groceries",
      value: 15,
      amount: -45.0,
      color: "#FFA500",
      icon: <ShoppingBasket className="h-6 w-6 text-white" />,
    },
    { name: "Rent", value: 20, amount: -45.0, color: "#4169E1", icon: <Home className="h-6 w-6 text-white" /> },
    { name: "Internet", value: 10, amount: -15.0, color: "#3CB371", icon: <Wifi className="h-6 w-6 text-white" /> },
  ]

  const incomeData: CategoryData[] = [
    { name: "Salary", value: 75, amount: 1000.0, color: "#D2B48C", icon: <Briefcase className="h-6 w-6 text-white" /> },
    { name: "Freelance", value: 25, amount: 330.0, color: "#40E0D0", icon: <Camera className="h-6 w-6 text-white" /> },
  ]

  const currentData = activeView === "income" ? incomeData : expenseData

  // Check if data
  const hasData = selectedMonth === "This Month"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Title */}
      <div className="bg-emerald-500 px-4 pb-6">
        <h1 className="text-xl font-semibold text-center text-white py-4">Money Manager</h1>

        {/* Income/Expense button */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`px-8 py-1.5 rounded-full text-sm border ${
              activeView === "income" ? "bg-white text-emerald-600 " : "text-black border-black"
            }`}
            onClick={() => setActiveView("income")}
          >
            Income
          </button>
          <button
            className={`px-8 py-1.5 rounded-full text-sm border ${
              activeView === "expense" ?  "bg-white text-red" : "text-black border-black"
            }`}
            onClick={() => setActiveView("expense")}
          >
            Expense
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-6 px-2 justify-center">
          {months.map((month) => (
            <button
              key={month}
              className={`whitespace-nowrap pb-1 ${
                selectedMonth === month ? "text-white font-medium border-b-2 border-white" : "text-white/70"
              }`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        {hasData ? (
          <>
            {/* Chart */}
            <div className="h-[200px] mb-4">
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
                    {currentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-y-4 mb-8 ml-12">
            {currentData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-center w-full"
              >
                {/* Dots and Names */}
                <div className="flex w-1/2 justify-end items-center gap-2">
                  {/* dot container */}
                  <div className="w-4 flex justify-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  {/* name container */}
                  <div className="w-32 text-left">
                    <span className="text-sm">{item.name}</span>
                  </div>
                </div>

                {/* Value */}
                <div className="w-1/2 flex justify-start pl-8">
                  <span className="text-sm">{item.value}.00%</span>
                </div>
              </div>
            ))}
          </div>

            {/* List */}
            <div className="space-y-3">
              <h2 className="font-medium px-1">{activeView === "income" ? "Income" : "Expense"} Lists:</h2>
              {currentData.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl p-3 flex items-center gap-3">
                  <div className="rounded-full p-3" style={{ backgroundColor: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm">{item.value}.00%</span>
                    </div>
                    <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: activeView === "income" ? "#10B981" : "#FF0000",
                        }}
                      />
                    </div>
                    <div className="mt-1 text-right">
                      <span
                        className="text-sm"
                        style={{
                          color: activeView === "income" ? "#10B981" : "#FF0000",
                        }}
                      >
                        {activeView === "income" ? "+" : ""}
                        {Math.abs(item.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileSearch className="h-16 w-16 mb-4" strokeWidth={1} />
            <p className="text-lg">No records</p>
          </div>
        )}
      </div>

      {/* <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}
    </div>
  )
}