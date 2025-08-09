import { Navbar } from "@/components/layout/navbar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { KanbanBoard } from "../kanban/kanban-board"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main
        className="flex-1 flex items-center justify-center px-12 py-12"
      >
        <div className="w-full max-w-6xl">
          <div className="mx-auto">
            <KanbanBoard />
          </div>
        </div>
      </main>
    </div>
  )
}