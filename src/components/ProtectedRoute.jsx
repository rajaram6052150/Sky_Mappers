"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function ProtectedRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  return <>{children}</>
}