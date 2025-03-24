/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from "react"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/customeInput"

function AccountManagementPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)

  // Get user ID from token when component mounts
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]))
        setUserId(tokenPayload.sub)
      } catch (err) {
        console.error("Failed to parse token:", err)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setError("")

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!currentPassword) {
      setError("Current password is required")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/password?password=${encodeURIComponent(newPassword)}&oldPassword=${encodeURIComponent(currentPassword)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )

      if (response.ok) {
        router.push("/profile/settings")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to change password")
      }
    } catch (err) {
      setError("Failed to change password")
      console.error("Failed to change password:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TabWithCancelButton text="Change Password" onClick={() => router.push("/profile/settings")} />

      <div className="min-h-screen pt-16 px-4 bg-background">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red border border-red-100 rounded-lg">{error}</div>}

            <div>
              <label className="block text-sm mb-1">
                Enter Current Password <span className="text-red">*</span>
              </label>
              <PasswordInput
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Enter New Password <span className="text-red">*</span>
              </label>
              <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Re-Enter New Password <span className="text-red">*</span>
              </label>
              <PasswordInput
                placeholder="Re-Enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 mt-6"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AccountManagementPage

