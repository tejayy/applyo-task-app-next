"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Board } from "./kanban-board"

interface EditBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateBoard: (board: Board) => void
  board: Board | null
}

const boardColors = [
  { 
    name: "Emerald", 
    emoji: "🌿", 
    value: "bg-emerald-100", 
    preview: "bg-emerald-200",
    border: "border-emerald-300",
    text: "text-emerald-700"
  },
  { 
    name: "Sky Blue", 
    emoji: "☁️", 
    value: "bg-sky-100", 
    preview: "bg-sky-200",
    border: "border-sky-300",
    text: "text-sky-700"
  },
  { 
    name: "Violet", 
    emoji: "🔮", 
    value: "bg-violet-100", 
    preview: "bg-violet-200",
    border: "border-violet-300",
    text: "text-violet-700"
  },
  { 
    name: "Amber", 
    emoji: "☀️", 
    value: "bg-amber-100", 
    preview: "bg-amber-200",
    border: "border-amber-300",
    text: "text-amber-700"
  },
  { 
    name: "Rose", 
    emoji: "🌹", 
    value: "bg-rose-100", 
    preview: "bg-rose-200",
    border: "border-rose-300",
    text: "text-rose-700"
  },
  { 
    name: "Indigo", 
    emoji: "🌌", 
    value: "bg-indigo-100", 
    preview: "bg-indigo-200",
    border: "border-indigo-300",
    text: "text-indigo-700"
  },
  { 
    name: "Teal", 
    emoji: "🌊", 
    value: "bg-teal-100", 
    preview: "bg-teal-200",
    border: "border-teal-300",
    text: "text-teal-700"
  },
  { 
    name: "Orange", 
    emoji: "🍊", 
    value: "bg-orange-100", 
    preview: "bg-orange-200",
    border: "border-orange-300",
    text: "text-orange-700"
  },
  { 
    name: "Lime", 
    emoji: "🍃", 
    value: "bg-lime-100", 
    preview: "bg-lime-200",
    border: "border-lime-300",
    text: "text-lime-700"
  },
  { 
    name: "Fuchsia", 
    emoji: "💜", 
    value: "bg-fuchsia-100", 
    preview: "bg-fuchsia-200",
    border: "border-fuchsia-300",
    text: "text-fuchsia-700"
  },
  { 
    name: "Cyan", 
    emoji: "💎", 
    value: "bg-cyan-100", 
    preview: "bg-cyan-200",
    border: "border-cyan-300",
    text: "text-cyan-700"
  },
  { 
    name: "Slate", 
    emoji: "🗿", 
    value: "bg-slate-100", 
    preview: "bg-slate-200",
    border: "border-slate-300",
    text: "text-slate-700"
  }
]

export function EditBoardDialog({ open, onOpenChange, onUpdateBoard, board }: EditBoardDialogProps) {
  const [title, setTitle] = useState("")
  const [selectedColor, setSelectedColor] = useState(boardColors[0].value)

  useEffect(() => {
    if (board) {
      setTitle(board.title)
      setSelectedColor(board.color)
    }
  }, [board])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && board) {
      const updatedBoard: Board = {
        ...board,
        title: title.trim(),
        color: selectedColor
      }
      onUpdateBoard(updatedBoard)
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setSelectedColor(boardColors[0].value)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
          <DialogDescription>
            Update your board&apos;s title and color theme.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Board Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter board title..."
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Choose Board Color</Label>
              <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {boardColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`group relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedColor === color.value
                        ? `${color.border} ${color.value} shadow-md`
                        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <div className={`w-8 h-8 rounded-full ${color.preview} mb-2 shadow-sm group-hover:shadow-md transition-shadow`} />
                    <div className="text-center">
                      <div className="text-lg mb-1">{color.emoji}</div>
                      <span className={`text-xs font-medium ${
                        selectedColor === color.value ? color.text : 'text-gray-600'
                      }`}>
                        {color.name}
                      </span>
                    </div>
                    {selectedColor === color.value && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center mt-2">
                Select a color theme for your board
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update Board</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
