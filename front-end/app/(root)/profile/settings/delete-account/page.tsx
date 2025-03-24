"use client"
import { useState } from "react"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"
import { DeleteConfirmation } from "@/components/delete-alert"
import { signOut } from "next-auth/react"

function DeleteAccountPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        // Clear all local storage items
        localStorage.removeItem("accessToken")
        localStorage.removeItem("tokenTimestamp")
        localStorage.removeItem("refreshToken")

        try {
          await signOut({ redirect: false })
        } catch (e) {
          console.error("Error signing out from next-auth:", e)
        }

        router.push("/login")
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to delete account" }))
        setError(errorData.message || "Failed to delete account. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      setError("An error occurred while deleting your account.")
    } finally {
      setIsDeleting(false)
      if (!error) {
        setShowConfirmation(false)
      }
    }
  }

  return (
    <>
      <TabWithCancelButton text="Delete Account" onClick={() => router.push("/profile/settings")} />

      <div className="min-h-screen pt-16 px-4 bg-background">
        <div className="max-w-md mx-auto">
          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-4">Delete my account</h1>

            <p className="text-gray-700 mb-6">
              We&apos;re sorry to see you go! If you proceed, your account will be permanently deleted along with all your
              data. This action cannot be undone, and you will lose all your saved preferences, messages, and any other
              information associated with your account.
            </p>

            <p className="text-gray-700 mb-2">Please confirm your decision.</p>
            <p className="text-gray-700 mb-8">We wish you all the best ❤️</p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red border border-red-100 rounded-lg">{error}</div>}

            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-3 px-6 rounded-lg bg-red text-white hover:bg-red/90 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md">
            <DeleteConfirmation onConfirm={handleDeleteAccount} onCancel={() => setShowConfirmation(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteAccountPage

