/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BudgetBarChart from "./components/barChart";
import PieChartComponent from "./components/pieChartForReport";
import AccountCard from "./components/card";
import { numberConverter } from "@/lib/utils"; 

interface PieData {
  name: string;
  value: any;
  color: string;
}

const Page: React.FC = () => {
  const [reportData, setReportData] = useState<{
    total_income: number;
    total_expense: number;
    total_remaining: number;
  } | null>(null);

  // Fetch data
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

  const fetchData = async (url: string) => {
    try {
      const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch data");
      return await res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  // Yearly reports
  const [totalBalance, setTotalBalance] = useState<0 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const year = dayjs().year();

  const fetchYearlyReport = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const data = await fetchData(`${process.env.NEXT_PUBLIC_API_URL}/accounts/yearlyreport?year=${year}`);
    if (data) {
      setReportData(data);
    } else {
      setError("Failed to fetch the report");
    }
  };

  useEffect(() => {
    fetchYearlyReport();
  }); // Added dependency array for clarity

  // Fetch Balance
  useEffect(() => {
    const fetchBalance = async () => {
      const balanceData = await fetchData(`${process.env.NEXT_PUBLIC_API_URL}/accounts/balance`);
      if (balanceData) {
        setTotalBalance(balanceData.amount);
      } else {
        setError("Failed to fetch the balance");
      }
    };
    fetchBalance();
  }); // Added dependency array for clarity

  const currentYear = dayjs().year();
  const total_expense = reportData ? reportData.total_expense / 100 : 0;
  const total_income = reportData ? reportData.total_income / 100 : 0;
  const total_remaining = reportData ? reportData.total_remaining / 100 : 0;
  const total_balance = totalBalance ? totalBalance / 100 : 0;

  const totalReport: PieData[] = reportData
    ? [
        { name: "Income", value: total_income, color: "hsl(var(--chart-2))" },
        { name: "Expense", value: total_expense, color: "hsl(var(--chart-1))" },
        {
          name: "Remaining",
          value: total_remaining,
          color: "hsl(var(--chart-3))",
        },
      ]
    : [];

  const displayReport = totalReport.slice(1, 3);

  return (
    <div className="space-y-4 min-h-screen pb-24 flex flex-col items-center px-4">
      {error && <p className="text-red-500">{error}</p>}
      {/* Account Card */}
      <div className="w-full h-40 mt-16 rounded-xl relative overflow-hidden">
        <AccountCard value={numberConverter(total_balance)} />
      </div>
      <div className="space-y-2 min-w-full mb-14 flex flex-col justify-items-stretch container">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Expense Report: {currentYear}</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pie Chart */}
            <div className="flex flex-col items-center">
            <PieChartComponent
              pieData={displayReport}
              numberConverter={numberConverter}
              remainingBalance={total_income}
            />
            <div className="flex flex-row justify-between w-full">
              {displayReport.map((entry, index) => (
                <div key={index} className="w-full flex">
                  <div className="flex flex-col items-center w-full p-4">
                    <div className="text-white font-sm font-thin px-2 py-1 rounded-full" style={{ background: entry.color }}>
                    {entry.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
             
            {/* Total Income/Expense/Remaining Report */}
            <div className="flex flex-row justify-between w-full">
              {totalReport.map((entry, index) => (
                <div key={index} className="w-full flex">
                  <div className="flex flex-col items-center w-full">
                    <h5 className="description-regular">{entry.name}</h5>
                    <p className="description-medium" style={{ color: entry.color }}>
                      {numberConverter(entry.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Budget Bar Chart */}
        <BudgetBarChart />
      </div>
    </div>
  );
};

export default Page;
