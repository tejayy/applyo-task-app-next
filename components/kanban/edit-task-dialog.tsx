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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task } from "./kanban-board"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (task: Task) => void
  task: Task | null
}

export function EditTaskDialog({ open, onOpenChange, onUpdateTask, task }: EditTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium" as "low" | "medium" | "high"
  })

  useEffect(() => {
    if (task) {
      let dateValue = ""
      let timeValue = ""
      
      if (task.dueDate) {
        if (task.dueDate.includes('T')) {
          // DateTime format
          const [date, time] = task.dueDate.split('T')
          dateValue = date
          timeValue = time
        } else {
          // Date only format
          dateValue = task.dueDate
        }
      }
      
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: dateValue,
        dueTime: timeValue,
        priority: task.priority
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim() && task) {
      // Combine date and time if both are provided
      let dueDateTimeString = undefined
      if (formData.dueDate) {
        if (formData.dueTime) {
          dueDateTimeString = `${formData.dueDate}T${formData.dueTime}`
        } else {
          dueDateTimeString = `${formData.dueDate}T23:59` // Default to end of day
        }
      }

      const updatedTask: Task = {
        ...task,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        dueDate: dueDateTimeString,
        priority: formData.priority
      }
      onUpdateTask(updatedTask)
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "medium"
    })
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-task-title">Task Title *</Label>
              <Input
                id="edit-task-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-task-description">Description</Label>
              <Textarea
                id="edit-task-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter task description (optional)..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-due-date">Due Date</Label>
                  <Input
                    id="edit-due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    min={today}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-due-time">Due Time</Label>
                  <Input
                    id="edit-due-time"
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => handleInputChange("dueTime", e.target.value)}
                    disabled={!formData.dueDate}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: "low" | "medium" | "high") => 
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}