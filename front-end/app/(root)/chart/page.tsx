"use client";
import { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Icon } from "@iconify/react";
import NavBar from "@/layouts/NavBar";
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories";

type ChartData = {
  categoryID: string;
  value: number;
  amount: number;
};

export default function ChartPage() {
  const { fetchWithToken } = useAuthFetch();
  const [activeView, setActiveView] = useState<"income" | "expense">("expense");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Use the by-month endpoint
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/by-month/${selectedMonth}`
      );
      const data = await response.json();
      const transactionsData = Array.isArray(data) ? data : data.transactions || [];
      setTransactions(transactionsData);
    };
    fetchData();
  }, [selectedMonth]);

  // group by category and calculate percentages.
  const processData = (): ChartData[] => {
    const filtered = transactions.filter(t => {
      // Convert the amount based on type: expense becomes negative.
      const amt = t.type === "EXPENSE" ? -Math.abs(parseFloat(t.amount)) : Math.abs(parseFloat(t.amount));
      // if active view is income => positive amounts; if expense => negative.
      return activeView === "income" ? amt > 0 : amt < 0;
    });

    const grouped = filtered.reduce((acc: Record<number, ChartData>, t: any) => {
      const key = Number(t.categoryID);
      if (!acc[key]) {
        acc[key] = { categoryID: String(key), value: 0, amount: 0 };
      }
      const amt = t.type === "EXPENSE" ? -Math.abs(parseFloat(t.amount)) : Math.abs(parseFloat(t.amount));
      acc[key].value += Math.abs(amt);
      acc[key].amount += amt;
      return acc;
    }, {} as Record<number, ChartData>);

    const total = Object.values(grouped).reduce((sum, item) => sum + item.value, 0);

    return Object.values(grouped).map(item => ({
      ...item,
      value: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }));
  };

  const currentData = processData();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-emerald-500 px-4 pb-6">
        <h1 className="text-xl font-semibold text-center text-white py-4">Financial Analysis</h1>

        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`px-8 py-1.5 rounded-full text-sm border ${
              activeView === "income"
                ? "bg-white text-emerald-600"
                : "text-white border-white"
            }`}
            onClick={() => setActiveView("income")}
          >
            Income
          </button>
          <button
            className={`px-8 py-1.5 rounded-full text-sm border ${
              activeView === "expense"
                ? "bg-white text-red-500"
                : "text-white border-white"
            }`}
            onClick={() => setActiveView("expense")}
          >
            Expense
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 px-2 justify-center">
          {months.map(month => (
            <button
              key={month}
              className={`whitespace-nowrap pb-1 ${
                selectedMonth === month
                  ? "text-white font-medium border-b-2 border-white"
                  : "text-white/70"
              }`}
              onClick={() => setSelectedMonth(month)}
            >
              {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Icon icon="mdi:file-search-outline" className="h-16 w-16 mb-4" />
            <p className="description-big-medium">No records this month</p>
          </div>
        ) : (
          <>
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
                    {currentData.map((entry, index) => {
                      const category = TRANSACTION_CATEGORIES[Number(entry.categoryID)] || {
                        name: "Other",
                        icon: <Icon icon="mdi:help-circle" className="text-white" />,
                        color: "#888888",
                      };
                      return <Cell key={index} fill={category.color} />;
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h2 className="font-medium px-1">
                {activeView === "income" ? "Income" : "Expense"} Breakdown:
              </h2>
              {currentData.map(item => {
                const category = TRANSACTION_CATEGORIES[Number(item.categoryID)] || {
                  name: "Other",
                  icon: <Icon icon="mdi:help-circle" className="text-white" />,
                  color: "#888888",
                };

                return (
                  <div key={item.categoryID} className="bg-white rounded-2xl p-3 flex items-center gap-3">
                    <div className="rounded-full p-3" style={{ backgroundColor: category.color }}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm">{item.value}%</span>
                      </div>
                      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                      <div className="mt-1 text-right">
                        <span
                          className="text-sm"
                          style={{
                            color: activeView === "income" ? "#10B981" : "#EF4444",
                          }}
                        >
                          {activeView === "income" ? "+" : "-"}$
                          {Math.abs(item.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <NavBar />
    </div>
  );
}
