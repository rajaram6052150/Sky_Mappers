"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        document.cookie = `token=${data.token}; path=/`
        window.dispatchEvent(new Event("authChanged")) // 🔄 update Navbar
        router.push("/dashboard")
      } else {
        setError(data.non_field_errors?.[0] || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl bg-gradient-to-br from-[#0a192f] to-[#112240] border-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8ed51] to-[#d8dd41] text-transparent bg-clip-text">Welcome back</h1>
                <p className="text-gray-300 text-balance mt-2">
                  Login to your Sky Mappers account
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-300">Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 placeholder:text-gray-500 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-gray-400 hover:text-[#e8ed51] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>              <Button 
                type="submit" 
                className="w-full bg-[#e8ed51] hover:bg-[#d8dd41] text-[#0a192f] font-medium" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm text-gray-300">
                Don't have an account?{" "}
                <span
                  onClick={() => router.push('/register')}
                  className="underline underline-offset-4 cursor-pointer text-[#e8ed51] hover:text-[#d8dd41]"
                >
                  Sign up
                </span>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block bg-gradient-to-br from-[#112240] to-[#0a192f]">
            <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8ed51]/10 to-transparent"></div>
            <img
              src="/globe.svg"
              alt="Authentication"
              className="absolute inset-0 h-full w-full object-cover p-8 opacity-60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
