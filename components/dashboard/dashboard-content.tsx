"use client";

import { KanbanBoard } from "@/components/kanban/kanban-board";

export function DashboardContent() {

  return (
    <div className="flex-1 space-y-6 pt-6">
      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  );
}
