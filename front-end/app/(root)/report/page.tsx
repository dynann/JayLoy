"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  PieCharts,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  LabelList,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthFetch } from "@/hooks/useAuthFetch";

// Define TypeScript interfaces
interface Transaction {
  id: number;
  amount: string; // API might return string numbers
  type: "INCOME" | "EXPENSE";
  category?: string;
  date: string;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}
const chartConfig = {
  Expense: {
    label: "Expense",
    color: "#3EB075", // primary color
  },
} satisfies ChartConfig;
const pieChartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Bar chart data
const chartData = [
  { month: "January", Expense: 100 },
  { month: "February", Expense: 80 },
  { month: "March", Expense: 60 },
  { month: "April", Expense: 73 },
  { month: "May", Expense: 89 },
  { month: "June", Expense: 110 },
  { month: "July", Expense: 100 },
  { month: "August", Expense: 100 },
  { month: "September", Expense: 100 },
  { month: "October", Expense: 50 },
  { month: "November", Expense: 40 },
  { month: "December", Expense: 50 },
];

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
    (sum, t) => sum - parseFloat(t.amount), // - cos it  should  be take out
    0
  );
  const remainingBalance = totalIncome - totalExpense;

  // Prepare pie chart data
  const pieData: PieData[] = [
    { name: "Expense", value: totalExpense, color: "hsl(var(--chart-2))" },
    {
      name: "Remaining",
      value: remainingBalance,
      color: "hsl(var(--chart-1))",
    },
  ];

  return (
    <div className="space-y-4 min-h-screen  flex flex-col items-center px-4">
      <div className="space-y-2 min-w-full p-4 flex flex-col justify-items-center container">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Limit</CardTitle>
            <CardDescription>Limit Budget: 100 USD per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData} margin={{ top: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="Expense" fill="#3EB075" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total expenses for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* Pie Chart for Expense vs Remaining */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Expense Report</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: $${value.toLocaleString()}`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                   
                </Pie>
                
              </PieChart>
              {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total expenses for the last 6 months
                    </div>
                  </CardFooter> */}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
