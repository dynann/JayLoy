"use client";
import GreenCard from "@/public/images/GreenCardd.jpg";
import Image from "next/image";
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
  const [reportData, setReportData] = useState<{
    total_income: number;
    total_expense: number;
    total_remaining: number;
  } | null>(null);

  const [totalBalance, setTotalBalance] = useState<{
    id: number;
    name: string;
    balance: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchYearlyReport = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const userID = 2;
      const year = dayjs().year();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/yearlyReport?userID=${userID}&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched reportdata:", data);
        setReportData(data);
      } else {
        setError("Failed to fetch the report");
      }
    } catch (err) {
      setError("Failed to fetch the report");
      console.error("Failed to report", err);
    }
  };

  useEffect(() => {
    fetchYearlyReport();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userID = 2;
        const year = dayjs().year();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/${userID}?year=${year}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch the balance");

        const data = await res.json();
        console.log("Fetched Balance:", data);
        setTotalBalance(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch the balance");
      }
    };

    fetchBalance();
  }, []);

  const currentYear = dayjs().year();

  function numberConverter(num: number) {
    const absNum = Math.abs(num);
    let formatted = "";
    if (absNum >= 1_000_000_000_000) {
      formatted = (absNum / 1_000_000_000_000).toFixed(2) + "T";
    } else if (absNum >= 1_000_000_000) {
      formatted = (absNum / 1_000_000_000).toFixed(2) + "B";
    } else if (absNum >= 1_000_000) {
      formatted = (absNum / 1_000_000).toFixed(2) + "M";
    } else if (absNum >= 1_000) {
      formatted = (absNum / 1_000).toFixed(2) + "k";
    }  else if (absNum >= 1_00) {
        formatted = (absNum / 1_000).toFixed(2) + "k";
    } else {
      formatted = absNum.toFixed(2);
    }
    return num < 0 ? `-$${formatted}` : `$${formatted}`;
  }

  const total_expense = reportData ? reportData.total_expense / 100 : 0;
  const total_income = reportData ? reportData.total_income / 100 : 0;
  const total_remaining = reportData ? reportData.total_remaining / 100 : 0;
  const total_balance = totalBalance ? totalBalance.balance/100 : 0;

  const totalReport: PieData[] = reportData
    ? [
        { name: "Income", value: total_income, color: "hsl(var(--chart-3))" },
        { name: "Expense", value: total_expense, color: "hsl(var(--chart-1))" },
        { name: "Remaining", value: total_remaining, color: "hsl(var(--chart-2))" },
      ]
    : [];

  let displayReport = totalReport.slice(0, 2);

  return (
    <div className="space-y-4 min-h-screen pb-24 flex flex-col items-center px-4">
      {error && <p className="text-red-500">{error}</p>}

      {/* Account Card */}
      <div className="w-full h-56 mt-16 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
        <Image
          src={GreenCard}
          className="relative object-cover w-full h-full rounded-xl"
          alt="card"
        />
        <AccountCard
          username="username"
          email="san.setha@testing.com"
          value={numberConverter(total_balance)}
        />
      </div>

      <div className="space-y-2 min-w-full mb-14 flex flex-col justify-items-stretch container">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Expense Report: {currentYear}</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pie Chart */}
            <PieChartComponent
              pieData={displayReport}
              numberConverter={numberConverter}
              remainingBalance={total_remaining}
            />

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
