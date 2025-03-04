This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- npm i --legacy-peer-deps
- git fetch origin   # Fetch the latest changes from the remote
- git pull --rebase origin main
- npx prisma migrate dev
- localhost:3000/docs#
- git stash || git stash pop # keep and release your stash back 
- git branch -D branch_name # delete the branch


 
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

// Bar chart configuration
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

function Page({ value }: { value: string }) {
  const { fetchWithToken, loading, error } = useAuthFetch();

  // const [pieChartData, setPieChartData] = useState([
  //   { report: "Expense", visitors: 0, fill: "var(--color-expense)" },
  //   { report: "Income", visitors: 0, fill: "var(--color-income)" },
  // ]);
  

  const [selectedYear,  setSelectedYear] = useState(2025);
  const [transactions ,setTransactions ] = useState([]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?year=${selectedYear}`
        )
        const data = await response.json()
        setTransactions(Array.isArray(data) ? data : data.transactions || [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        setTransactions([])
      }
    }
    fetchTransactions()
  }, [fetchWithToken, selectedYear])


  const incomeTransactions = transactions.filter(t => t.type === "INCOME")
const expenseTransactions = transactions.filter(t => t.type === "EXPENSE")

  
const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
const remainingBalance = totalIncome - totalExpense
const total = totalIncome // Base for percentage calculation
const pieData = total > 0 ? [
  { name: "Expense", value: (totalExpense / total) * 100, amount: totalExpense },
  { name: "Remaining", value: (remainingBalance / total) * 100, amount: remainingBalance }
] : []

  // // Calculate total visitors as the sum of Expense and Income
  // const totalIncome = pieChartData[1]?.visitors || 0;
  // const totalExpense = pieChartData[0]?.visitors || 0;
  // const maxAmount = totalIncome + totalExpense; // Sum of total income and total expense

  // // Prepare the data for the pie chart
  // const data = pieChartData; // Now this includes both Expense and Income

  return (
    <div className="space-y-2 flex flex-col items-center px-4">
      <div className="space-y-2 min-w-full m-16 flex flex-col justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Limit</CardTitle>
            <CardDescription>Limit Budget: 100 USD per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 10,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="Expense" fill="var(--color-Expense)" radius={8}>
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={10} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* Pass the combined data for both Expense and Income */}
        {/* <PieCharts
          title="Yearly Report"
          maxAmount={maxAmount} // Total amount as the sum of Expense and Income
          amount={data} // Pass both Expense and Income data
          description="Yearly report of expenses vs income"
          pieChartConfig={pieChartConfig}
        /> */}

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} dataKey="value">
      <Cell key="expense" fill="#DD0A0A" />
      <Cell key="remaining" fill="#3EB075" />
    </Pie>
  </PieChart>
</ResponsiveContainer>

      </div>
    </div>
  );
}

export default Page;
