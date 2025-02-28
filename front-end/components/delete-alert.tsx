interface DeleteConfirmationProps {
    onConfirm: () => void
    onCancel: () => void
  }
  
  export function DeleteConfirmation({ onConfirm, onCancel }: DeleteConfirmationProps) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium text-center mb-2">Permanently Delete Record</h2>
        <p className="text-center text-gray-600 mb-6">Please confirm your decision.</p>
  
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-6 rounded-full bg-red text-white hover:bg-red/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }
  
  