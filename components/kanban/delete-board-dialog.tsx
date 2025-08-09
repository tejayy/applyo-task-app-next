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
import { Board } from "./kanban-board"

interface DeleteBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteBoard: () => void
  board: Board | null
}

export function DeleteBoardDialog({ open, onOpenChange, onDeleteBoard, board }: DeleteBoardDialogProps) {
  const handleDelete = () => {
    onDeleteBoard()
    onOpenChange(false)
  }

  const taskCount = board?.tasks.length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Board</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this board? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {board && (
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded ${board.color.replace('bg-', 'bg-').replace('-100', '-200')}`} />
              <div>
                <h4 className="font-medium text-sm">{board.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {taskCount === 0 
                    ? "No tasks" 
                    : `${taskCount} task${taskCount > 1 ? 's' : ''} will be deleted`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {taskCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Warning</p>
                <p className="text-amber-700">
                  Deleting this board will permanently remove all {taskCount} task{taskCount > 1 ? 's' : ''} inside it.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}