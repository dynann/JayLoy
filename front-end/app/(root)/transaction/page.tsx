"use client";
import { TransactionInput } from "@/components/customeInput";
import { Button } from "@/components/ui/button";
import {  DropdownMenuDemo } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
 


function Transaction() {
  const containerClasses =
    "min-h-screen flex flex-col items-center justify-center px-4 gap-4";
  const [transactionType, setTransactionType] = useState(""); //  "Expense" or "Income"
  const [amount, setAmount] = useState(""); // " " value

  const handleTransactionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionType(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // - number if "Expense" is selected
    if (transactionType === "Expense" && value !== "") {
      if (!value.startsWith("-")) {
        value = `-${value}`; // the value starts with "-"
      }
    } else if (transactionType === "Income" && value.startsWith("-")) {
      value = value.replace("-", ""); // Remove "-" for income
    }

    setAmount(value);
  };
  return (
    <div className={containerClasses}>
      {/* tabbar in layout applied  */}

      <div className=" w-full bg-background p-0">
        <div className="mx-auto max-w-md px-6 py-12 bg-background border-0 shadow-lg sm:rounded-3xl">
          <h1 className="text-2xl   mb-8">Add record </h1>
          <form id="form">
            <TransactionInput
              type="text"
              placeholder="Choose Category"
              desc="Category is required"
            />
            {/* add a Category button to choose  */}

            {/* radio button for expense and and income */}
            <fieldset className="relative z-0 w-full p-px mb-5">
              <legend className="description-small text-black ">
                Choose type of transaction
              </legend>
              <div className="block pt-3 pb-2 space-x-4">
                <label className="text-red">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Expense"
                    onChange={handleTransactionTypeChange}
                    className="mr-2 accent-red  text-red border-3  border-red  focus:border-red focus:ring-red"
                  />
                  Expense
                </label>
                <label className="text-primary">
                  <input
                    type="radio"
                    name="transactionType"
                    value="income"
                    onChange={handleTransactionTypeChange}
                    className="mr-2  accent-primary text-primary border-3 border-primary focus:border-primary focus:ring-primary"
                  />
                  Income
                </label>
              </div>
              <span className="text-sm text-red hidden" id="error">
                Option has to be selected
              </span>
            </fieldset>

            <div className="relative z-0 w-full mb-5 flex items-center gap-2">
              {/* Left Side: Dropdown */}
              <div className="shrink-0">
                <DropdownMenuDemo />
              </div>

              {/* Right Side: Input Field */}
              {/* <input
                type="number"
                name="money"
                placeholder="Amount"
                className="pt-3 pb-2 px-3 w-full bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              /> */}
              <TransactionInput
                type="number"
                placeholder="Amount"
                desc="Amount is required"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>

            <TransactionInput
              type="date"
              value=" "
              placeholder="date"
              desc="Date is required"
            />

            {/* auto setting for date */}

            {/* <div className="relative z-0 w-full mb-5">
              <select
                name="select"
                value=""
                // onClick="this.setAttribute('value', this.value);"
                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200"
              >
                <option value="" selected disabled hidden></option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
                <option value="5">Option 5</option>
              </select>
              <label className="absolute duration-300 top-3 -z-1 origin-0 text-gray">
                Select an option
              </label>
              <span className="text-sm text-red-600 hidden" id="error">
                Option has to be selected
              </span>
            </div> */}

            <div className="flex flex-row space-x-4">
              <TransactionInput
                type="text"
                placeholder="Note"
                desc="Note is required"
              />
            </div>
            <Button type="submit" className="green-button !text-white">Add Record</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
