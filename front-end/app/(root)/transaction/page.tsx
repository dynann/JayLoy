"use client"

import { TransactionInput } from "@/components/customeInput"
import { Button } from "@/components/ui/button"
import { DropdownMenuDemo } from "@/components/ui/dropdown-menu"
import React, { useState, useEffect } from "react"
import ExpenseModal, { IncomeModal } from "./components/popupModal"
import { useRouter, useSearchParams } from "next/navigation"

interface TransactionFormProps {
  isEditing?: boolean
  existingTransaction?: any
}

export default function Transaction({ isEditing, existingTransaction }: TransactionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getLocalDate()); // Use local date
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(1);

  // Helper function to get the current date in local time zone
  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // january is index start from 0
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Load existing transaction data if editing
  useEffect(() => {
    if (isEdit && existingTransaction) {
      setTransactionType(existingTransaction.type === "EXPENSE" ? "Expense" : "Income");
      setAmount(Math.abs(existingTransaction.amount).toString());
      setDate(existingTransaction.date);
      setDescription(existingTransaction.description || "");
      setCategory(existingTransaction.categoryID);
    }
  }, [isEdit, existingTransaction]);

  // Set default category based on transaction type
  useEffect(() => {
    if (transactionType === "Expense") {
      setCategory(1)
    } else if (transactionType === "Income") {
      setCategory(10)
    }
  }, [transactionType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/transactions/${existingTransaction.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/accounts/insert`

      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          type: transactionType.toUpperCase(),
          description,
          date,
          categoryID: category,
        }),
      })

      if (!res.ok) throw new Error("Failed to save transaction")

      router.push("/")
    } catch (err) {
      alert(isEdit ? "Failed to update transaction!" : "Failed to create new transaction!")
    }
  }

  const categoryType = () => {
    return transactionType === "Expense" ? (
      <ExpenseModal category={category} setCategory={setCategory} />
    ) : (
      <IncomeModal category={category} setCategory={setCategory} />
    )
  }

  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value

    if (transactionType === "Expense" && value !== "") {
      if (!value.startsWith("-")) {
        value = `-${value}`
      }
    } else if (transactionType === "Income" && value.startsWith("-")) {
      value = value.replace(`${value}`, "")
    }
    setAmount(value)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
      <div className="w-full bg-background p-0 relative z-0">
        <div className="mx-auto max-w-md px-6 py-12 bg-background border-0 shadow-lg sm:rounded-3xl">
          <h1 className="text-2xl mb-8">{isEdit ? "Edit record" : "Add record"}</h1>
          <form id="form" onSubmit={handleSubmit}>
            <fieldset className="relative z-0 w-full p-px mb-5">
              <legend className="description-small text-black">Choose type of transaction</legend>
              <div className="block pt-3 pb-2 space-x-4">
                <label className="text-red">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Expense"
                    checked={transactionType === "Expense"}
                    onClick={() => setAmount("")}
                    onChange={handleTransactionTypeChange}
                    className="mr-2 accent-red text-red border-3 border-red focus:border-red focus:ring-red"
                    required
                  />
                  Expense
                </label>

                <label className="text-primary">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Income"
                    checked={transactionType === "Income"}
                    onClick={() => setAmount("")}
                    onChange={handleTransactionTypeChange}
                    className="mr-2 accent-primary text-primary border-3 border-primary focus:border-primary focus:ring-primary"
                  />
                  Income
                </label>
              </div>
            </fieldset>

            <div className="relative z-50 w-full mb-5 flex items-center justify-between gap-2">
              <legend className="description-small text-black">Category</legend>
              <div className="shrink-0">{categoryType()}</div>
            </div>

            <div className="relative z-0 w-full mb-5 flex items-center gap-2">
              <legend className="description-small text-black">Amount</legend>
              <div className="shrink-0">
                <DropdownMenuDemo />
              </div>
              <TransactionInput
                type="number"
                placeholder="0.00"
                desc="Amount is required"
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </div>

            <legend className="description-small text-black">Date</legend>
            <TransactionInput
              type="date"
              placeholder="Date"
              desc="Date is required"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <TransactionInput
              type="text"
              placeholder="Description"
              desc="Description is required"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button type="submit" className="green-button !text-white">
              {isEdit ? "Save Changes" : "Add Record"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}