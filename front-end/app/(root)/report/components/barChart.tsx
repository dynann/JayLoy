"use client"
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { Bar, BarChart, LabelList } from "recharts"
import { TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

const chartConfig = {
    Expense: {
      label: "Expense",
      color: "#3EB075", // primary color
    },
  } satisfies ChartConfig;

 
  
  export default function BudgetBarChart (): React.JSX.Element {
    const [MonthlyReport, setMonthlyReport] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(10);



  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/transaction/monthly/totalExpense?year=2025`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch the expense the data");
        const monthlyData = await res.json();
        setMonthlyReport(monthlyData);
        console.log("month",monthlyData)
      } catch (error) {
        console.error(error);
        setError("Failed to fetch the balance");
      }
    };

    fetchMonthlyReport();
  }, []);
  useEffect(() => {}, [MonthlyReport]);
  console.log("MonthlyReport",MonthlyReport)
    
    return <div>
      <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Limit</CardTitle>
              <CardDescription>Limit Budget: 100 USD per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={MonthlyReport} //month
                 margin={{ top: 10 }}>
                  <RechartsPrimitive.CartesianGrid vertical={false} />
                  <RechartsPrimitive.XAxis
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
                You spend 10% less than Feburary.<TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Your savings has been increased for the past 2 months.
              </div>
            </CardFooter>
          </Card>
    </div>
  }
function setError(arg0: string) {
    throw new Error("Function not implemented.")
}
  