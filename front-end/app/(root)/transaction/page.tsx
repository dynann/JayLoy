"use client"

import { TransactionInput } from "@/components/customeInput"
import { Button } from "@/components/ui/button"
import { DropdownMenuDemo } from "@/components/ui/dropdown-menu"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import ExpenseModal, { DisabledButton, IncomeModal }  from "./components/popupModal";
import { useRouter, useSearchParams } from "next/navigation"
import dayjs from "dayjs"

interface TransactionFormProps {
  isEditing?: boolean
  existingTransaction?: any
}

export default function Transaction({ isEditing, existingTransaction }: TransactionFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("edit") === "true"

  const [transactionType, setTransactionType] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(getLocalDate())
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(1)
  const [transactionTypeError, setTransactionTypeError] = useState("")
  const [amountError, setAmountError] = useState("")

  // Helper function to get the current date in local time zone
  function getLocalDate() {
    return dayjs().format("YYYY-MM-DD")
  }

  // Helper function format date string to YYYY-MM-DD
  const formatDate = useCallback((dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD")
  }, [])

  // Load existing transaction data if editing
  useEffect(() => {
    if (isEdit) {
      const storedTransaction = localStorage.getItem("editingTransaction")
      if (storedTransaction) {
        const transaction = JSON.parse(storedTransaction)
        setTransactionType(transaction.type === "EXPENSE" ? "Expense" : "Income")
        setAmount(Math.abs(transaction.amount).toString())
        // Format YYYY-MM-DD
        setDate(formatDate(transaction.date))
        setDescription(transaction.description || "")
        setCategory(transaction.categoryID)
        // Keep the transaction data for the ID when updating
        localStorage.setItem("editingTransaction", JSON.stringify(transaction))
      }
    }
  }, [isEdit, formatDate])

  // Set default category based on transaction type only if not editing
  useEffect(() => {
    if (!isEdit) {
      if (transactionType === "Expense") {
        setCategory(1)
      } else if (transactionType === "Income") {
        setCategory(10)
      }
    }
  }, [transactionType, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setTransactionTypeError("")
    setAmountError("")

    // Validate transaction type
    if (!transactionType) {
      setTransactionTypeError("Please select a transaction type.")
      return
    }

    // Validate amount
    let trimmedAmount = amount.trim()
    if (!trimmedAmount || trimmedAmount === "-") {
      setAmountError("Please enter a valid amount.")
      return
    }

    const positiveAmount = Math.abs(parseFloat(trimmedAmount));
    try {
      // Get the stored transaction data for the ID when editing
      const storedTransaction = isEdit
        ? JSON.parse(localStorage.getItem("editingTransaction") || "{}")
        : null

      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/transactions/${storedTransaction.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/accounts/insert`

      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount:positiveAmount,
          type: transactionType.toUpperCase(),
          description,
          date,
          categoryID: category,
        }),
      })

      if (!res.ok) throw new Error("Failed to save transaction")
        console.log({amount});
      console.log({ positiveAmount });

      router.push("/")
    } catch (err) {
      alert(isEdit ? "Failed to update transaction!" : "Failed to create new transaction!")
    }
  }

  const categoryType = () => {
    if (!transactionType ){
      return <DisabledButton label="Category" className={"bg-gray"} onClick={undefined}/>
    } else if ( transactionType === "Income"){
      return  <IncomeModal category={category} setCategory={setCategory} />
    }else if ( transactionType === "Expense"){
      return <ExpenseModal category={category} setCategory={setCategory} />
    }else{
      return "error"
    }
  }

  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value)
    setTransactionTypeError("") // Reset transaction type error when type is selected
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value

    // Allow only numbers and optional negative sign
    if (/^-?\d*\.?\d*$/.test(value)) {
      // - for expenses 
      if (transactionType === "Expense" && !value.startsWith("-")) {
        value = `-${value}`
      }
      // no - for income
      else if (transactionType === "Income" && value.startsWith("-")) {
        value = value.replace("-", "")
      }

      setAmount(value)
      setAmountError("") // Reset amount error when user starts typing
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
      <div className="w-full bg-background p-0 relative z-0">
        <div className="mx-auto max-w-md px-6 py-12 bg-background border-0 shadow-lg sm:rounded-3xl">
          <h1 className="text-2xl mb-8">{isEdit ? "Edit record" : "Add record"}</h1>
          <form id="form" onSubmit={handleSubmit}>
            {/* radio  */}
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
              {transactionTypeError && <p className="text-red text-sm">{transactionTypeError}</p>}
            </fieldset>
               {/* category */}
               <div className="relative z-50 w-full mb-5 flex items-center justify-between gap-2">
              <legend className="description-small text-black">Category</legend>
              <div className="shrink-0">{categoryType()}</div>
            </div>

            <div className="relative z-0 w-full mb-5 flex items-center gap-2">
              <legend className="description-small text-black">Amount</legend>
              <div className="shrink-0">
                <DropdownMenuDemo />
              </div>
              <div className="flex flex-col w-full">
                <TransactionInput
                  type="text"
                  placeholder="0.00"
                  desc="Amount is required"
                  value={amount}
                  onChange={handleAmountChange}
                />
                {amountError && <p className="text-red text-sm mt-1">{amountError}</p>}
              </div>
            </div>

            <legend className="description-small text-black">Date</legend>
            <TransactionInput
              type="date"
              placeholder="Date"
              desc="Date is required"
              value={date} // YYYY-MM-DD format
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