"use client"
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { Bar, BarChart, LabelList } from "recharts"
import { TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect } from "react"
import dayjs from "dayjs"

const chartConfig = {
    Expense: {
      label: "Expense",
      color: "#3EB075", // primary color
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
  
  export default function BudgetBarChart (): React.JSX.Element {
    // const fetchBalance = async () => {
    //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/balance`,{
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
    //       }
    //     })
    //   }
    //    const fetchYearlyReport = async (e?: React.FormEvent) => {
    //       e?.preventDefault();  // Prevent form submission if it's a form
          
    //       try {
    //         const userID = 2  ;   
    //         const year = dayjs().year(); 
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transaction/monthly/totalExpense/userID=${userID}?year=${year}`, {
    //           method: "GET",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //           },
    //         });
    //         if (res.ok) {
    //           const data = await res.json();
    //           console.log("Fetched reportdata:", data); //json of income, expense, remaning
    //         //   setReportData(data);
    //         } else {
    //           setError("Failed to fetch the report");
    //         }
    //       } catch (err) {
    //         setError("Failed to fetch the report");
    //         console.error("Failed to report", err);
    //       }
    //     };
    //       useEffect(() => {
    //         fetchYearlyReport();
    //       }, []);  //call 
    //       // console.log("report year", reportData)
    //     const fetchData = async (data: string, year: number) => {
    //       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${data}?year=${year}`,{
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
    //         }
    //       })
    //     }
    
    return <div>
      <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Limit</CardTitle>
              <CardDescription>Limit Budget: 100 USD per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData} margin={{ top: 10 }}>
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
  