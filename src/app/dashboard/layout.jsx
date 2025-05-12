import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        {children}
      </main>
    </ProtectedRoute>
  )
}