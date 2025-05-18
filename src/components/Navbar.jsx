"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Navbar({ className, ...props }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token") || getCookie("token")
      setIsLoggedIn(!!token)
      setAuthChecked(true)
    }

    updateAuth()
    window.addEventListener("authChanged", updateAuth)

    return () => {
      window.removeEventListener("authChanged", updateAuth)
    }
  }, [])

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    return match ? match[2] : null
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch("http://localhost:8000/accounts/logout/", {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
      }
      localStorage.removeItem("token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      window.dispatchEvent(new Event("authChanged"))
      setIsLoggedIn(false)
      router.replace("/")
      router.refresh()
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className={cn("bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-lg", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/")}
              className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-[#e8ed51] to-[#d8dd41] text-transparent bg-clip-text"
            >
              Sky Mappers
            </span>
          </div>

          {authChecked && (
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="bg-[#0a192f] text-[#e8ed51] hover:bg-[#112240] transition-colors text-lg"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/")}
                  className="bg-[#0a192f] text-[#e8ed51] hover:bg-[#112240] transition-colors text-lg"
                >
                  Login
                </Button>
              )}
            </div>
          )}

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-[#e8ed51] hover:bg-[#e8ed51]/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && authChecked && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className="w-full text-left bg-[#0a192f] text-[#e8ed51] hover:bg-[#112240] text-lg"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/")}
                className="w-full text-left bg-[#0a192f] text-[#e8ed51] hover:bg-[#112240] text-lg"
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
