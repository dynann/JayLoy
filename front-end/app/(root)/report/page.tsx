// import { BarChart } from "@/components/ui/chart";
'use client';
import React from "react";
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
  // BarChart,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
type ChartData = {
  categoryID: string
  value: number
  amount: number
}
const chartData = [
  { month: "January", Expense: 100 },
  { month: "February", Expense: 80 },
  { month: "March", Expense: 60 },
  { month: "April", Expense: 73 },
  { month: "May", Expense: 89 },
  { month: "June", Expense: 110 },
  { month: "Jul", Expense: 100 },
  { month: "Aug", Expense: 100 },
  { month: "Sep", Expense: 100 },
  { month: "Oct", Expense: 50 },
  { month: "Nov", Expense: 40 },
  { month: "Dec", Expense: 50 },
];
const currentData: any[] | undefined  = [
  // pie: { Label : "Income" || "Expense"|| "Remain", }
]

// bar chat setting 
const chartConfig = {
  Expense: {
    label: "Expense",
    color: "#3EB075",
  },
  
} satisfies ChartConfig;

const pieChartData = [
  { browser: "Expense", visitors: 50, fill: "var(--color-chrome)" },
  { browser: "Income", visitors: 100, fill: "var(--color-safari)" },
  // { browser: "Remain", visitors: 50, fill: "var(--color-firefox)" },
   ,
];
const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
function page({value}: {value:string}) {
  
  // const currentData = processData()
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  return (
    <div className="space-y-2 flex flex-col items-center px-4">
      Page
      <div className="space-y-2  min-w-full m-16 flex flex-col justify-center">
       

        {/* <BarChart/> */}

        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Limit</CardTitle>
            <CardDescription>Limit Budget: 100 USD per month </CardDescription>
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
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="Expense" fill="var(--color-Expense)" radius={8}>
                  {/* bar label  */}
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
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        <PieCharts
         title= "Yearly Report"

         description = "hello" 
         data ={pieChartData}
        //  description = "hello" 
        //  description = "hello" 

         pieChartConfig = {pieChartConfig}

        />

      </div>
    </div>
  );
}

export default page;
