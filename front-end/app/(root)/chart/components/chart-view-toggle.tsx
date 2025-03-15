"use client"

interface ChartViewToggleProps {
  activeView: "income" | "expense"
  onViewChange: (view: "income" | "expense") => void
}

export function ChartViewToggle({ activeView, onViewChange }: ChartViewToggleProps) {
  return (
    <div className="flex justify-center gap-3 mb-6">
      <button
        className={`px-8 py-1.5 rounded-full text-sm ${
          activeView === "income" ? "bg-white !text-primary" : "text-white border border-white"
        }`}
        onClick={() => onViewChange("income")}
      >
        Income
      </button>
      <button
        className={`px-8 py-1.5 rounded-full text-sm ${
          activeView === "expense" ? "bg-white !text-red" : "text-white border border-white"
        }`}
        onClick={() => onViewChange("expense")}
      >
        Expense
      </button>
    </div>
  )
}

