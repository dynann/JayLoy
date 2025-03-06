"use client";
import greenCard from "@/public/greencard.jpg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BudgetBarChart from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuthFetch } from "@/hooks/useAuthFetch";
interface Transaction {
  id: number;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category?: string;
  date: string;
}
interface PieData {
  name: string;
  value: number;
  color: string;
}
const Page: React.FC = () => {
  const { fetchWithToken } = useAuthFetch();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?year=${selectedYear}`
        );
        const data = await response.json();
        console.log("Fetched transactions:", data);

        setTransactions(Array.isArray(data) ? data : data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, [fetchWithToken, selectedYear]);
  // Categorize transactions
  const incomeTransactions = transactions.filter((t) => t.type === "INCOME");
  const expenseTransactions = transactions.filter((t) => t.type === "EXPENSE");
  // Calculate totals
  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );
  const remainingBalance = totalIncome - totalExpense;

  // Prepare pie chart data
  const pieData: PieData[] = [
    { name: "Expense", value: totalExpense, color: "hsl(var(--chart-1))" },
    {
      name: "Remaining",
      value: remainingBalance,
      color: "hsl(var(--chart-2))",
    },
  ];
  const totalReport: PieData[] = [
    { name: "Income", value: totalIncome, color: "hsl(var(--chart-3))" },
    { name: "Expense", value: totalExpense, color: "hsl(var(--chart-1))" },
    {
      name: "Remaining",
      value: remainingBalance,
      color: "hsl(var(--chart-2))",
    },
  ];
  return (
    <div className="space-y-4 min-h-screen   flex flex-col items-center px-4">
      {/* card  */}
      <div className="w-full h-56 mt-16   rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
      <Image src= {greenCard}  className="relative object-cover w-full h-full rounded-xl" alt="card" /> 
                
                <div className="w-full px-8 absolute top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-bold text-xl text-textColor">
                            San Setha  
                            </p>
                            <p className="font-medium tracking-widest  text-textColor">
                               setha.user@gmailcom   
                            </p>
                        </div>
                    </div>
                    <div className="pt-6 pr-0">
                        <div className="flex justify-between">
                        <button className="px-4 py-2 bg-secondary rounded-3xl font-body text-white">
                            View Expense History
                         </button> 
                            <div className="flex flex-col">
                                <p className=" text-3xl  font-black  text-textColor">
                                    ${remainingBalance}
                                </p>
                                <p className="font-bold tracking-more-wider text-sm   text-textColor ">
                                    Remained Balance
                                </p>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
      <div className="space-y-2 min-w-full my-14  flex flex-col justify-items-center container">
      
        {/* Pie Chart for Expense vs Remaining */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Expense Report: 2025</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={300}
              className="h-[300px] flex flex-col items-center"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: $${value.toLocaleString()}`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="header"
                >
                  ${remainingBalance}
                </text>{" "}
                <br />
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="description-small"
                >
                  Remaining
                </text>
              </PieChart>
            </ResponsiveContainer>
            {/* income | expense | Remain */}
            <div className="flex flex-row justify-between w-full">
              {totalReport.map((entry, index) => (
                <div key={index} className="w-full flex">
                  <div className="flex flex-col items-center w-full">
                    <h5 className="description-regular">{entry.name}</h5>
                    <p
                      className="sub-header"
                      style={{ color: entry.color }}
                    >{`$${entry.value}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* limit budget  */}
        <BudgetBarChart />
      </div>
    </div>
  );
};

export default Page;
