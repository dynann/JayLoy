"use client"

import { Icon } from "@iconify/react"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DeleteConfirmation } from "./delete-alert"
import { formatCurrency } from "@/utils/formatCurrency"

interface TransactionDetailProps {
  transaction: any
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TransactionDetail({ transaction, onClose, onEdit, onDelete }: TransactionDetailProps) {
  const router = useRouter()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const categoryInfo = TRANSACTION_CATEGORIES[transaction.categoryID] || {
    name: "Other",
    icon: <Icon icon="mdi:help-circle" className="text-white" />,
    color: "bg-gray",
  }

  const amount = Number.parseFloat(transaction.amount) / 100
  const isExpense = transaction.type === "EXPENSE"

  const handleEdit = () => {
    onEdit()
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setShowDeleteConfirmation(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-md">
        {showDeleteConfirmation ? (
          <DeleteConfirmation onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        ) : (
          <>
            {/* Header with close button */}
            <div className="flex justify-end pt-3 pr-7">
              <button onClick={onClose} className="text-gray hover:text-gray-600 transition-colors">
                <span className="text-2xl">X</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 -mt-2">
              {/* Category row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className={`${categoryInfo.color} p-4 rounded-2xl`}>{categoryInfo.icon}</div>
                    <button
                      onClick={handleEdit}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-primary hover:text-primary/80 text-lg transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </div>
                  <span className="text-2xl font-medium pl-2">{categoryInfo.name}</span>
                </div>
                <div className="flex items-center gap-5">
                  <span className={`text-2xl font-medium ${isExpense ? "text-red" : "text-primary"}`}>
                    {isExpense ? "-" : "+"}
                    {formatCurrency(Math.abs(amount), 2).replace("$", "")}
                  </span>
                  <button onClick={handleDelete} className="text-red hover:text-red/80 transition-colors">
                    <Icon icon="mdi:trash-can" className="w-8 h-8" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-12">
                {transaction.description && (
                  <div>
                    <h3 className="text-2xl mb-2">Note:</h3>
                    <p className="text-xl text-black">{transaction.description}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

