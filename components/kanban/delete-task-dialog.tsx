"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { Task } from "./kanban-board"

interface DeleteTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteTask: () => void
  task: Task | null
}

export function DeleteTaskDialog({ open, onOpenChange, onDeleteTask, task }: DeleteTaskDialogProps) {
  const handleDelete = () => {
    onDeleteTask()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {task && (
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground">{task.description}</p>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}