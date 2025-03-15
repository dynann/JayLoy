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
import greenCard from "@/public/images/greenCard.jpg";
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
 
  const [reportData, setReportData] = useState<{ 
    total_income: number; 
    total_expense: number; 
    total_remaining: number } | null>(null);
  const fetchYearlyReport = async (e?: React.FormEvent) => {
    e?.preventDefault();  // Prevent form submission if it's a form
    
    try {
      const data = 2;   
      const year = dayjs().year(); 
      
    
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/yearlyReport?userID=${data}&year=${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched reportdata:", data); //json of income, expense, remaning
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
    }, []);  //call 
    // console.log("report year;Y", reportData)
    
  const fetchData = async (data: string, year: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${data}?year=${year}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
      }
    }
    )
  }
  const fetchBalance = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/balance`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
      }
    }
    )
  }
  const currentYear = dayjs().year();
  const yearlyReport = fetchData("yearlyreport", currentYear);
  const totalExpenseEachMonth = fetchData("transaction/monthly/totalExpense", currentYear)
  const balance = fetchBalance();


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
        // console.log("Fetched transactions:", data);

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
      formatted =  (absNum / 1_000_000_000_000).toFixed(2) + "T";
    } else if (absNum >= 1_000_000_000) {
      formatted =  (absNum / 1_000_000_000).toFixed(2) + "B";
    } else if (absNum >= 1_000_000) {
      formatted =  (absNum / 1_000_000).toFixed(2) + "M";
    } else if (absNum >= 1_000) {
      formatted =  (absNum / 1_000).toFixed(2) + "k";
    } else if (absNum >= 1_00){
      formatted =  (absNum / 1_000).toFixed(2) + "k";
    }else {
      formatted =  absNum.toFixed(2);
    }
    return num < 0 ? `-$${formatted}` : `$${formatted}`;
  }
  // console.log("remain", remainingBalance + numberConverter(remainingBalance))
  //format
  // const remainBalanceDisplay = 
  // Prepare pie chart data
  const pieData: PieData[] = [
    { name: "Expense", value: setSelectedYear, color: "hsl(var(--chart-1))" },
    {
      name: "Remaining",
      value: remainingBalance,
      color: "hsl(var(--chart-2))",
    },
  ];
  //summary data
  // numberConverter(totalIncome)
  const total_expense = reportData ? reportData.total_expense / 100 : 0;
  const total_income = reportData ? reportData.total_income / 100 : 0;
  const total_remaining = reportData ? reportData.total_remaining / 100 : 0;

  const totalReport: PieData[] = reportData
  ? [
      { name: "Income", value: numberConverter(total_income), color: "hsl(var(--chart-3))" },
      { name: "Exspense", value: numberConverter(total_expense), color: "hsl(var(--chart-1))" },
      {
        name: "Remaining",
        value: numberConverter(total_remaining),
        color: "hsl(var(--chart-2))",
      },
    ]
  : [];
  let displayReport = totalReport.slice(0, 2); //display loop from 1 to 0

  
 
  
  return (
    <div className="space-y-4 min-h-screen pb-24 flex flex-col items-center px-4">
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
                  {numberConverter(total_remaining)}
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
            <CardTitle>Yearly Expense Report: {currentYear}</CardTitle>
            <CardDescription>Total Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {/* pie Chart  */}
            <PieChartComponent pieData={pieData} 
            numberConverter={numberConverter}
            remainingBalance ={total_remaining} /> 
           {/* remaining value in the middle */}

            {/* Total Income/Expense/Remaining Rxeport */}
            <div className="flex flex-row justify-between w-full">
              {totalReport.map((entry, index) => (
                <div key={index} className="w-full flex">
                  <div className="flex flex-col items-center w-full">
                    <h5 className="description-regular">{entry.name}</h5>
                    <p className="description-medium" style={{ color: entry.color }} >
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
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}


 