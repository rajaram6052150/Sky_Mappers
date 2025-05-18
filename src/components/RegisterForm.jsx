"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function RegisterForm({ className, ...props }) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log('Attempting registration with:', { username, email })
      const response = await fetch("http://localhost:8000/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, password2 }),
      })

      console.log('Response status:', response.status)
      if (response.ok || response.status === 201) {
        const data = await response.json()
        console.log('Registration successful:', data)
        if (data.token) {
          localStorage.setItem("token", data.token)
          document.cookie = `token=${data.token}; path=/`
          window.dispatchEvent(new Event("authChanged"))
          router.push("/dashboard")
        } else {
          console.error('No token in response:', data)
          setError("Registration successful but no token received")
        }
      } else {
        const text = await response.text()
        console.log('Error response:', text)
        try {
          const data = JSON.parse(text)
          setError(
            data.error || data.non_field_errors?.[0] ||
            "Registration failed. Email may already exist or passwords don't match."
          )
        } catch (e) {
          setError("Server error. Please try again later.")
        }
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#112240] p-6">
      <div className={cn("flex flex-col gap-6 w-full max-w-4xl", className)} {...props}>
        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-[#0a192f] to-[#112240] text-white w-full">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* FORM */}
            <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8ed51] to-[#d8dd41] text-transparent bg-clip-text">
                  Create an account
                </h1>
                <p className="text-gray-300 text-balance mt-2">
                  Sign up for a new Sky Mappers account
                </p>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="grid gap-3">
                <Label htmlFor="username" className="text-sm text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 placeholder:text-gray-500 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 placeholder:text-gray-500 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password" className="text-sm text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 placeholder:text-gray-500 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-password" className="text-sm text-gray-300">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  className="bg-[#112240]/50 border-[#2a3f63] text-gray-200 placeholder:text-gray-500 focus:border-[#e8ed51] focus:ring-[#e8ed51]/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#112240] hover:bg-[#172a46] text-[#e8ed51] font-medium border border-[#e8ed51]/20 hover:border-[#e8ed51]/50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm text-gray-300">
                Already have an account?{" "}
                <span
                  onClick={() => router.push('/')}
                  className="underline underline-offset-4 cursor-pointer hover:text-[#e8ed51]"
                >
                  Login
                </span>
              </div>
            </form>

            {/* IMAGE PANEL */}
            <div className="relative hidden md:block bg-gradient-to-br from-[#112240] to-[#0a192f]">
              <img
                src="/reg.png"
                alt="Registration Drone Visual"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8ed51]/10 to-transparent" />
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-[#e8ed51]">Terms of Service</a>{" "}
          and <a href="#" className="underline hover:text-[#e8ed51]">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
