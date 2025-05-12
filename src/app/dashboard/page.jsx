"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from "@/components/imageUploader"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ImageUploader />
      </div>
    </div>
  )
}