"use client";
import greenCard from "@/public/images/greenCard.jpg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BudgetBarChart from "@/app/(root)/report/components/chart";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import PieChartComponent from "./components/barChart";
interface Transaction {
  id: number;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category?: string;
  date: string;
}
interface PieData {
  name: string;
  value: any;
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
    (sum, t) => sum + parseFloat(t.amount)/100, 0
  );
  const totalExpense =expenseTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount)/100,
    0)
  ;
  const remainingBalance = (totalIncome - totalExpense);
  
  function numberConverter(num: number) { //math.abs if nega -> convert -> set the format
    const absNum = Math.abs(num);
    let formatted = "";
    if (absNum >= 1_000_000_000_000) {
      formatted =  (absNum / 1_000_000_000_000).toFixed(1) + "T";
    } else if (absNum >= 1_000_000_000) {
      formatted =  (absNum / 1_000_000_000).toFixed(1) + "B";
    } else if (absNum >= 1_000_000) {
      formatted =  (absNum / 1_000_000).toFixed(1) + "M";
    } else if (absNum >= 1_000) {
      formatted =  (absNum / 1_000).toFixed(1) + "k";
    } else {
      formatted =  absNum.toFixed(1);
    }
    return num < 0 ? `-$${formatted}` : `$${formatted}`;
  }
  console.log("remain", remainingBalance + numberConverter(remainingBalance))
  //format
  // const remainBalanceDisplay = 
  // Prepare pie chart data
  const pieData: PieData[] = [
    { name: "Expense", value: totalExpense, color: "hsl(var(--chart-1))" },
    {
      name: "Remaining",
      value: remainingBalance,
      color: "hsl(var(--chart-2))",
    },
  ];
  //summary data
  const totalReport: PieData[] = [
    { name: "Income", value: numberConverter(totalIncome), color: "hsl(var(--chart-3))" },
    { name: "Expense", value: numberConverter(totalExpense), color: "hsl(var(--chart-1))" },
    {
      name: "Remaining",
      value: numberConverter(remainingBalance),
      color: "hsl(var(--chart-2))",
    },
  ];
  
  return (
    <div className="space-y-4 min-h-screen   p-16 flex flex-col items-center px-4">
      {/* card  */}
      <div className="w-full h-56 mt-16   rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
        <Image
          src={greenCard}
          className="relative object-cover w-full h-full rounded-xl"
          alt="card"
        />
        <div className="w-full px-8 absolute top-8">
          <div className="flex justify-between">
            <div className="">
              <p className="font-bold text-xl text-textColor">San Setha</p>
              <p className="font-medium tracking-widest  text-textColor">
                setha.user@gmailcom
              </p>
            </div>
          </div>
          <div className="pt-6 pr-0">
            <div className="flex justify-between">
              <button className="px-4 py-2 bg-secondary rounded-3xl font-body text-white">
                View History
              </button>
              <div className="flex flex-col">
                <p className=" text-3xl  font-black  text-textColor">
                  {numberConverter(remainingBalance)}
                </p>
                <p className="font-bold tracking-more-wider text-sm   text-textColor ">
                  Remained Balance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2 min-w-full mb-14  flex flex-col justify-items-stretch container">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Expense Report: 2025</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {/* pie Chart  */}
            <PieChartComponent pieData={pieData} 
            numberConverter={numberConverter}
            remainingBalance ={remainingBalance} />

            {/* Total Income/Expense/Remaining Rxeport */}
            <div className="flex flex-row justify-between w-full">
              {totalReport.map((entry, index) => (
                <div key={index} className="w-full flex">
                  <div className="flex flex-col items-center w-full">
                    <h5 className="description-regular">{entry.name}</h5>
                    <p className="sub-header" style={{ color: entry.color }} >
                      {entry.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* limit budget : bar Chart */}
        <BudgetBarChart />
      </div>
    </div>
  );
};
export default Page;
