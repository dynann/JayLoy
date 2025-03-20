"use client"
import { useState } from "react"
import { TabWithCancelButton } from "@/layouts/Tabbar"
import { useRouter } from "next/navigation"

function AccessibilityPage() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // Dak joal sin teh
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <>
      <TabWithCancelButton text="Accessibility" onClick={() => router.push("/profile/settings")} />

      <div className="min-h-screen pt-16 px-4 bg-background">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Change Theme</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Light Theme</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    className="sr-only peer"
                    checked={theme === "light"}
                    onChange={() => handleThemeChange("light")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Dark Theme</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    className="sr-only peer"
                    checked={theme === "dark"}
                    onChange={() => handleThemeChange("dark")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccessibilityPage

