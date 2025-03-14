"use client"
import { useState, useEffect } from "react"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { TransparentInput } from "@/components/customeInput"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import Image from "next/image"
import ProfileImage from "@/public/images/plant.webp"

function ProfileDetailsPage() {
  const router = useRouter()
  const containerClasses = "min-h-screen flex flex-col items-center pt-16 px-4 gap-4 bg-background"

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // get the user ID from the token
        const token = localStorage.getItem("accessToken")
        if (!token) {
          router.push("/login")
          return
        }

        // Parse the JWT token to get the user ID
        const tokenPayload = JSON.parse(atob(token.split(".")[1]))
        const id = tokenPayload.sub // 'sub' is typically where the user ID is stored
        setUserId(id)

        // fetch the user data using the ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUsername(userData.username || "")
          setEmail(userData.email || "")
        } else {
          setError("Failed to fetch user data")
        }
      } catch (err) {
        setError("Failed to fetch user data")
        console.error("Failed to fetch user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSaveChanges = async () => {
    if (!userId) {
      setError("User ID not found")
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      })

      if (response.ok) {
        router.push("/profile")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update profile")
      }
    } catch (err) {
      setError("Failed to update profile")
      console.error("Failed to update profile:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TabWithCancelButton text="Edit" onClick={() => router.push("/profile")} />

      <div className={containerClasses}>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Icon icon="line-md:loading-twotone-loop" className="w-10 h-10 text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 mb-6">
              <Image
                className="w-20 h-20 p-1 rounded-full ring-2 ring-primary dark:ring-gray"
                src={ProfileImage || "/placeholder.svg"}
                alt="Profile image"
              />
              <span className="text-sm font-medium">Edit</span>
            </div>

            <div className="w-full max-w-md">
              {error && <div className="mb-4 p-3 bg-red-50 text-red border border-red-100 rounded-lg">{error}</div>}

              <div className="bg-white rounded-xl shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <span className="text-sm text-gray-600 flex-1">Username</span>
                  <div className="w-1/2">
                    <TransparentInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center p-4 border-b border-gray-100">
                  <span className="text-sm text-gray-600 flex-1">email</span>
                  <div className="w-1/2">
                    <TransparentInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center p-4">
                  <span className="text-sm text-gray-600 flex-1">Phone</span>
                  <div className="w-1/2">
                    <TransparentInput type="text" value="None" onChange={() => {}} />
                  </div>
                </div>
              </div>

              <div className="mt-6 px-4">
                <Button
                  type="button"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ProfileDetailsPage

