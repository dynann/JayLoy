/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import PiggyBank from "@/public/images/piggy-bank.png";
import { TextInput } from "@/components/customeInput";
import { DropdownMenuDemo } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TabWithCancelButton } from "@/layouts/Tabbar";
import { useEffect, useState } from "react";

// http://localhost:3000/limitBudget
export default function LimitBudgetPage() {
  const containerClasses =
    "min-h-screen flex flex-col items-center justify-center px-4 gap-4";
  const contentWrapperClasses =
    "w-full max-w-md space-y-8 flex flex-col items-center";
  const textCenterClasses = "text-center";
  const inputGroupClasses = "flex flex-row items-center";
  const formClasses = "space-y-4 flex flex-col gap-y-4";
  const footerClasses = "flex flex-col gap-4 items-end text-center";
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^-?\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
     
      setAmount(value);
    }
  };
  
  const amountInCent = amount === "" ? 0 : parseFloat(amount) * 100;

   const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    const budgetData = {
      amount: amountInCent,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(budgetData),
      });
      if (!res.ok) {
        throw new Error("Failed to set budget. Please try again.");
      }
      router.push("/report");
    } catch (error: any) {
      console.log(error)
      setError("failed to fetch");
    }
  };
   //budget Budget limit
    const [budget, setBudget] =  useState<0 | null>(null);
    const budgetLimit = budget ? budget / 100 : 0;
    useEffect(() => {
      const fetchBudget = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets/get`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch the balance");
  
          const budget = await res.json(); 
          setBudget(budget.amount)
        } catch (error) {
          console.error("Failed to fetch:", error);
          setError("Failed to fetch the balance");
        }
      };
      fetchBudget();
    }, []);  
    useEffect(() => {
    }, [budget]); 
  
  return (
    <>
      <TabWithCancelButton href="/report" text="Limit Budget" />
      <div className={containerClasses}>
        <div className={contentWrapperClasses}>
          <div className={textCenterClasses}>
            <h1 className="header">Limit Your Monthly Budget</h1>
            <p className="description-medium mt-2">
              Spend wisely, waste less, save more
            </p>
          </div>
          <Image src={PiggyBank} width={124} height={124} alt="Piggy Bank" />
          <form className={formClasses} onSubmit={handleSubmit} method="POST">
            <div className={inputGroupClasses}>
              <TextInput
                type="number"
                placeholder={budgetLimit}
                value={amount}
                onChange={handleNumberInput}
                
              />
              <DropdownMenuDemo />
            </div>
            {error && <p className="text-red text-sm">{error}</p>}
            <div className={footerClasses}>
              <p className="small-text">
                &quot;Control your spending today to create a wealthier tomorrow.
                Small savings today grow into big opportunities for your
                future.&quot; 💰✨
              </p>
              <Button type="submit" className="green-button !text-white">
                Set goal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

