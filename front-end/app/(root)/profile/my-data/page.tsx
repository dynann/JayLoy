"use client"
import { useState } from "react"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"
import { DeleteConfirmation } from "@/components/delete-alert"
import LoadingOverlay from "@/components/LoadingOverlay"

function MyDataPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleDeleteData = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      setActionLoading("Deleting data...")

      // fetch from backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/deleteall`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        router.push("/profile")
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete data" }))
        setError(errorData.message || "Failed to delete data. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting data:", error)
      setError("An error occurred while deleting your data.")
    } finally {
      setIsDeleting(false)
      setActionLoading(null)
      if (!error) {
        setShowConfirmation(false)
      }
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={!!actionLoading} message={actionLoading || "Loading..."} />
      <TabWithCancelButton text="My Data" onClick={() => router.push("/profile")} />

      <div className="min-h-screen pt-16 px-4 bg-gray-100">
        <div className="max-w-md mx-auto">
          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-4">Request to delete my data</h1>

            <p className="text-gray-700 mb-4">
              By Deleting all your existing data, all the progress and resource will be deleted completely.
            </p>

            <p className="text-gray-700 mb-6">Your account will be reset with an empty data and record.</p>

            <p className="text-gray-700 font-medium mb-8">Are you sure you want to delete your data?</p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red border border-red-100 rounded-lg">{error}</div>}

            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-3 px-6 rounded-lg bg-red text-white hover:bg-red/90 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete all my data"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md">
            <DeleteConfirmation onConfirm={handleDeleteData} onCancel={() => setShowConfirmation(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default MyDataPage

