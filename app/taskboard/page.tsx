import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TaskboardPage() {

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Taskboard</h1>
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-gray-500">Taskboard content will go here...</p>
          </div>
        </div>
      </main>
    </div>
  </ProtectedRoute>
  )
}
