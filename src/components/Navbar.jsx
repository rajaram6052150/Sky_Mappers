"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Navbar({
  className,
  ...props
}) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const response = await fetch("http://localhost:8000/accounts/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        })

        if (response.ok) {
          localStorage.removeItem("token")
          setIsLoggedIn(false)
          router.push("/")
        } else {
          console.error("Logout failed")
        }
      }
    } catch (err) {
      console.error("Error during logout:", err)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={cn(
        "bg-background border-b border-border sticky top-0 z-50 bg-grey-50",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span
              onClick={() => router.push("/")}
              className="text-2xl font-bold cursor-pointer text-primary"
            >
              Sky Mappers
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-primary hover:text-primary-foreground"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full text-left hover:bg-primary hover:text-primary-foreground"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}