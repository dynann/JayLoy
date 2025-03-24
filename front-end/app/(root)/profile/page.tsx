/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import ProfileImage from "@/public/images/plant.webp"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import LoadingOverlay from "@/components/LoadingOverlay"

function ProfilePage() {
  const containerClasses = "min-h-screen flex flex-col items-center justify-center px-4 pb-24 gap-2 bg-background"
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmAction: () => {},
    cancelAction: () => {},
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmClass: "bg-primary",
    icon: null as React.ReactNode
  })
  
  
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("accessToken")
        if (!token) {
          router.push("/login")
          return
        }

        // Parse the JWT token to get the user ID
        const tokenPayload = JSON.parse(atob(token.split(".")[1]))
        const id = tokenPayload.sub // 'sub' is typically where the user ID is stored
        setUserId(id)

        // fetch user ID
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

  const performLogout = async () => {
    try {
      setActionLoading("Log Out")
      await signOut({ redirect: false });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      })

      if (res.ok) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("tokenTimestamp")
        localStorage.removeItem("refreshToken")
        console.log("logout successfully")
        router.push("/login")
      } else {
        setError("Failed to log out")
      }
    } catch (err) {
      setError("Failed to log out")
      console.error("Failed to log out:", err)
    } finally {
      setActionLoading(null)
    }
  }
  
  const handleLogout = (e?: React.FormEvent) => {
    e?.preventDefault()
    showLogoutConfirmation()
  }
  
  const showLogoutConfirmation = () => {
    setModalConfig({
      title: "Log Out",
      message: "Are you sure you want to log out of your account?",
      confirmAction: () => {
        setShowModal(false)
        performLogout()
      },
      cancelAction: () => setShowModal(false),
      confirmText: "Log Out",
      cancelText: "Cancel",
      confirmClass: "bg-red active:bg-red-700 transition-colors",
      icon: <Icon icon="ph:sign-out-fill" className="text-red-600" width="32" height="32" />
    })
    setShowModal(true)
  }

  const handleMenuAction = (item: any) => {
    if (item.title === "Log Out") {
      showLogoutConfirmation()
    } else if (item.action) {
      item.action()
    } else if (item.route) {
      setActionLoading(item.title)
      router.push(item.route)
    }
  }

  const menuItems = [
    {
      title: "Edit Profile",
      icon: <Icon icon="ph:user-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/profileDetails",
      highlight: false,
    },
    {
      title: "My Data",
      icon: <Icon icon="ph:database-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/my-data",
      highlight: false,
    },
    {
      title: "Setting",
      icon: <Icon icon="ph:gear-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/settings",
      highlight: false,
    },
    {
      title: "Terms & Privacy Policy",
      icon: <Icon icon="ph:file-text-fill" className="text-primary" width="24" height="24" />,
      route: "/profile/terms&policy",
      highlight: false,
    },
    {
      title: "Log Out",
      icon: <Icon icon="ph:sign-out-fill" className="text-primary" width="24" height="24" />,
      action: handleLogout,
      highlight: true,
    },
  ]

  return (
    <div className={containerClasses}>
      <LoadingOverlay 
        isLoading={!!actionLoading} 
        message={actionLoading === "Log Out" ? "Logging out..." : `Loading ${actionLoading}...`} 
      />
      
      {/* Confirmation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col items-center">
              {/* Icon at top */}
              <div className="mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                {modalConfig.icon}
              </div>
              
              {/* Title and message */}
              <h3 className="text-xl font-bold text-center mb-2">{modalConfig.title}</h3>
              <p className="text-gray-600 text-center mb-6">{modalConfig.message}</p>
              
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={modalConfig.cancelAction}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {modalConfig.cancelText}
                </button>
                <button
                  onClick={modalConfig.confirmAction}
                  className={`px-4 py-3 rounded-lg text-white font-medium ${modalConfig.confirmClass}`}
                >
                  {modalConfig.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col items-center px-1 pb-2">
        {/* Profile Image and Information */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            className="w-24 h-24 p-1 rounded-full ring-2 ring-primary dark:ring-gray mb-3"
            src={ProfileImage || "/placeholder.svg"}
            alt="Profile image" priority={true}
          />
          <h2 className="text-xl font-medium text-center mb-1">{loading ? "Loading..." : username}</h2>
          <p className="text-gray-600 text-center">{loading ? "Loading..." : email}</p>
        </div>

        {/* Menu Items */}
        <div className="w-full">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg flex items-center justify-between w-full ${
                item.highlight ? "bg-red-50" : "hover:bg-gray-50"
              } cursor-pointer`}
              onClick={() => handleMenuAction(item)}
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

        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg w-full">{error}</div>}
      </div>
    </div>
  )
}

export default ProfilePage

