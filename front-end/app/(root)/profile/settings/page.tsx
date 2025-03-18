"use client"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

function SettingsPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()
  
  // Move token retrieval and user ID extraction to useEffect
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
      return
    }
    
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]))
      const id = tokenPayload.sub
      setUserId(id)
    } catch (error) {
      console.error("Error parsing token:", error)
      router.push("/login")
    }
  }, []);
  
  const settingsItems = [
    {
      title: "Account Management",
      icon: <Icon icon="ph:user-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings/accountManagement",
      highlight: false,
    },
    {
      title: "Help & Support",
      icon: <Icon icon="ph:lifebuoy-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings/support",
      highlight: false,
    },
    {
      title: "Notification",
      icon: <Icon icon="ph:bell-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings/notifications",
      highlight: false,
    },
    {
      title: "Accessibility",
      icon: <Icon icon="ph:eye-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings/accessibility",
      highlight: false,
    },
    {
      title: "Delete Account",
      icon: <Icon icon="ph:trash-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings/delete-account",
      highlight: true,
      action: async () => {
        if (!userId) return;
        
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }
        console.log(userId)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "DELETE",
          })
          if(!response.ok) {
            throw new Error("Error deleting account")
          } 
          console.log(response)
          // Clear local storage and redirect after successful deletion
          localStorage.removeItem("accessToken")
          localStorage.removeItem("tokenTimestamp")
          localStorage.removeItem("refreshToken")
          router.push("/login")
        } catch (error) {
          console.error("Error deleting account:", error)
        }
      }
    },
    {
      title: "Log Out",
      icon: <Icon icon="ph:sign-out-fill" className="text-primary" width="24" height="24" />,
      action: async () => {
        // Handle logout
        await signOut({ redirect: false })
        localStorage.removeItem("accessToken")
        localStorage.removeItem("tokenTimestamp")
        localStorage.removeItem("refreshToken")
        router.push("/login")
      },
      highlight: true,
    },
  ]

  return (
    <>
      <TabWithCancelButton text="Settings" onClick={() => router.push("/profile")} />

      <div className="min-h-screen pt-16 px-4 bg-background">
        <div className="max-w-md mx-auto">
          {/* Settings Menu */}
          <div className="w-full mt-4">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg flex items-center justify-between w-full ${
                  item.highlight ? "bg-red-50" : "hover:bg-gray-50"
                } cursor-pointer`}
                onClick={() => {
                  if (item.action) {
                    item.action()
                  } else if (item.route) {
                    router.push(item.route)
                  }
                }}
              >
                {/* Left side with icon and title */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${item.highlight ? "bg-red-100" : "bg-tertiary"} flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                  <span className={`font-medium ${item.highlight ? "text-red" : "text-gray-800"}`}>{item.title}</span>
                </div>

                {/* Chevron icon */}
                <Icon icon="ph:caret-right" className={`w-5 h-5 ${item.highlight ? "text-red" : "text-gray-400"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsPage