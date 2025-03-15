"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"

interface CategoryModalProps {
  category: number
  setCategory: (n: number) => void
  type: "Expense" | "Income"
}
interface DisabledButtonProps{
  label: any;
  onClick: any;
  className: any;
}

const PopupModal: React.FC<CategoryModalProps> = ({ category, setCategory, type }) => {
  const categoriesArray = Object.values(TRANSACTION_CATEGORIES)
  const isExpense = type === "Expense"

  // Filter categories based on type
  const filteredCategories = categoriesArray.filter((category) =>
    isExpense ? category.id >= 0 && category.id <= 9 : category.id >= 10 && category.id <= 12,
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(
    TRANSACTION_CATEGORIES[category]?.name || (isExpense ? "Food" : "Salary"),
  )
  const [selectedColor, setSelectedColor] = useState(
    TRANSACTION_CATEGORIES[category]?.color || (isExpense ? "bg-red" : "bg-brown"),
  )

  // Update selected category and color when category prop changes
  useEffect(() => {
    const categoryInfo = TRANSACTION_CATEGORIES[category]
    if (categoryInfo) {
      setSelectedCategory(categoryInfo.name)
      setSelectedColor(categoryInfo.color)
    }
  }, [category])
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const disableButton = (p0: number) => {
    setButtonDisabled(true);
    // alert("Button has been disabled!");
};
  return (
    <div>
      {/* Button to Open Modal */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
        
        className={`text-white ${selectedColor} hover:bg-white hover:text-black shadow-sm focus:ring-1 focus:outline-none focus:ring-gray rounded-lg px-5 py-2.5 text-center inline-flex items-center`}
        
      >
        {selectedCategory}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative z-80 p-4 w-full max-w-md bg-white rounded-lg shadow-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="description-medium">Choose a category</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray bg-transparent hover:bg-gray hover:text-gray-900 rounded-lg text-sm h-8 w-8 inline-flex justify-center items-center"
              >
                <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <p className="smalltext font-normal text-gray">
                Choose a category for your {isExpense ? "Expense" : "Income"} transaction.
              </p>

              {/* Category Options */}
              <div className="grid grid-cols-3 content-center gap-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setSelectedColor(category.color)
                      setCategory(category.id)
                      setIsOpen(false) // Close modal after selection
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer py-3 text-gray"
                  >
                    <div className={`${category.color} p-3 rounded-lg`}>{category.icon}</div>
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exporting Expense and Income Modals
const ExpenseModal: React.FC<{ category: number; setCategory: (n: number) => void }> = (props) => (
  <PopupModal {...props} type="Expense"  />
)

const IncomeModal: React.FC<{ category: number; setCategory: (n: number) => void }> = (props) => (
  <PopupModal {...props} type="Income" />
)
const DisabledButton: React.FC<DisabledButtonProps> = ({ onClick, label, className }) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const handleClick = () => {
    if (!isDisabled) {
      setIsDisabled(true)} }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`px-5 py-2.5 rounded-lg opacity-50  text-black 
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "  "
      } ${className}`}
    >
      {label}
    </button>
  )
}

export default ExpenseModal
export { IncomeModal, DisabledButton }

