"use client"

import { Icon } from "@iconify/react"
import { TRANSACTION_CATEGORIES } from "@/app/constants/categories"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DeleteConfirmation } from "./delete-alert"
import { formatCurrency } from "@/utils/formatCurrency"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"

interface TransactionDetailProps {
  transaction: any
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TransactionDetail({ transaction, onClose, onEdit, onDelete }: TransactionDetailProps) {
  const router = useRouter()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Icon icon="heroicons:x-mark" className="w-6 h-6" />
        </button>
        
        <div className="mb-6 flex items-center space-x-3">
          <div className={`${categoryInfo.color} p-2 rounded-lg`}>
            {categoryInfo.icon}
          </div>
          <h2 className="text-xl font-semibold">{categoryInfo.name}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className={`font-semibold ${isExpense ? "text-red" : "text-primary"}`}>
              {isExpense ? "-" : "+"}
              {formatCurrency(Math.abs(amount), 2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{dayjs(transaction.date).format("MMMM D, YYYY")}</span>
          </div>
          
          {/* Updated description section with overflow handling */}
          {transaction.description && (
            <div className="border-t border-gray-100 pt-3">
              <span className="text-gray-600 block mb-1">Description</span>
              <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto text-wrap">
                <p className="font-medium text-sm break-words whitespace-pre-wrap">{transaction.description}</p>
              </div>
            </div>
          )}
          
          {/* Image attachment section */}
          {transaction.imageUrl && (
            <div className="mt-4 border-t pt-4">
              <p className="text-gray-600 mb-2">Attachment</p>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setImageModalOpen(true)}
              >
                <Icon icon="heroicons:photo" className="w-5 h-5" />
                View Attachment
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Image Modal with proper accessibility structure */}
      {transaction.imageUrl && (
        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Transaction Receipt</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-80">
              <Image
                src={transaction.imageUrl}
                alt="Receipt"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation */}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  )
}

