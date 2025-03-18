"use client"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

function SettingsPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)
  
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

  const handleDeleteAccount = async () => {
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

  const handleLogout = async () => {
    // Handle logout
    await signOut({ redirect: false })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("tokenTimestamp")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }
  
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
      highlight: true,
      action: () => {
        setIsDeleteAccountDialogOpen(true)
        if(isDeleteAccountDialogOpen) {
          handleDeleteAccount()
        }
      },
    },
    {
      title: "Log Out",
      icon: <Icon icon="ph:sign-out-fill" className="text-primary" width="24" height="24" />,
      action: () => setIsLogoutDialogOpen(true),
      highlight: true,
    },
  ]

  return (
    <>
      <TabWithCancelButton text="Settings" onClick={() => router.push("/profile")} />
      <div className="min-h-screen pt-16 px-4 bg-background">
        <div className="divide-y divide-border">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between py-4 ${item.highlight ? "text-primary" : ""}`}
              onClick={() => {
                if (item.route) {
                  router.push(item.route)
                } else if (item.action) {
                  item.action()
                }
              }}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="description-medium">{item.title}</span>
              </div>
              <Icon icon="ph:caret-right" className="text-gray" width="20" height="20" />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
        title="Log Out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteAccountDialogOpen}
        onOpenChange={setIsDeleteAccountDialogOpen}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}

export default SettingsPage