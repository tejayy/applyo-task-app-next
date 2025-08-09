'use client';

import * as React from 'react';
import { motion, type Transition, AnimatePresence } from 'motion/react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/animate-ui/radix/checkbox';
import { Calendar, Edit, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from './kanban-board';

interface PlayfulBoardTodolistProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
});

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 1, ease: 'easeInOut' },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 1,
  },
});

function PlayfulBoardTodolist({ tasks, onToggleTask, onEditTask, onDeleteTask }: PlayfulBoardTodolistProps) {
  const [celebratingTasks, setCelebratingTasks] = React.useState<Set<string>>(new Set())
  const [justCompletedTasks, setJustCompletedTasks] = React.useState<Set<string>>(new Set())
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatRelativeTime = (dateTimeString: string) => {
    const dueDate = new Date(dateTimeString)
    const now = new Date()
    const diffMs = dueDate.getTime() - now.getTime()
    
    // If overdue (negative difference)
    if (diffMs < 0) {
      const overdueDiffMs = Math.abs(diffMs)
      const overdueHours = Math.floor(overdueDiffMs / (1000 * 60 * 60))
      const overdueDays = Math.floor(overdueDiffMs / (1000 * 60 * 60 * 24))
      
      if (overdueDays > 0) {
        return `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`
      } else if (overdueHours > 0) {
        return `${overdueHours} hour${overdueHours > 1 ? 's' : ''} overdue`
      } else {
        return 'Just overdue'
      }
    }
    
    // Calculate time remaining
    const hoursRemaining = Math.floor(diffMs / (1000 * 60 * 60))
    const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    // If it's today (less than 24 hours and same day)
    const isToday = dueDate.toDateString() === now.toDateString()
    
    if (isToday && hoursRemaining < 24) {
      if (hoursRemaining > 0) {
        return `in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`
      } else if (minutesRemaining > 0) {
        return `in ${minutesRemaining} min${minutesRemaining > 1 ? 's' : ''}`
      } else {
        return 'Due now'
      }
    }
    
    // If it's more than today, show in days
    if (daysRemaining > 0) {
      return `Due in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`
    }
    
    // Fallback for edge cases
    return `Due in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`
  }

  const isOverdue = (dateTimeString: string) => {
    const now = new Date()
    const due = new Date(dateTimeString)
    return due < now
  }



  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    
    if (task && !task.completed) {
      // Task is being completed - trigger celebration
      setCelebratingTasks(prev => new Set([...prev, taskId]))
      setJustCompletedTasks(prev => new Set([...prev, taskId]))
      
      // Remove celebration after animation
      setTimeout(() => {
        setCelebratingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }, 2000)
      
      // Remove just completed status after a longer delay
      setTimeout(() => {
        setJustCompletedTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }, 3000)
    }
    
    onToggleTask(taskId)
  }

  // Confetti particle component
  const ConfettiParticle = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        background: `hsl(${Math.random() * 360}, 70%, 60%)`,
        left: `${20 + Math.random() * 60}%`,
        top: '50%',
      }}
      initial={{ 
        scale: 0, 
        y: 0, 
        x: 0, 
        rotate: 0,
        opacity: 1 
      }}
      animate={{ 
        scale: [0, 1, 0.5, 0],
        y: [-20, -40, -20, 20],
        x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
        rotate: [0, 180, 360],
        opacity: [1, 1, 0.5, 0]
      }}
      transition={{ 
        duration: 1.5, 
        delay,
        ease: "easeOut"
      }}
    />
  )

  // Success message component
  const SuccessMessage = () => (
    <motion.div
      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg"
      initial={{ scale: 0, y: 10, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: -10, opacity: 0 }}
      transition={{ duration: 0.3, ease: "backOut" }}
    >
      <Sparkles className="h-3 w-3" />
      <span>Well done!</span>
    </motion.div>
  )

  // Empty state when no tasks
  if (tasks.length === 0) {
    return (
      <div className="bg-white/30 rounded-2xl p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">No tasks yet</p>
            <p className="text-xs text-gray-500">Add your first task to get started</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/30 rounded-2xl p-4 space-y-4">
      {tasks.map((task, idx) => (
        <div key={task.id} className="group space-y-4">
          <motion.div 
            className="relative flex items-start space-x-3 p-2 rounded-lg hover:bg-white/20 transition-colors"
            animate={celebratingTasks.has(task.id) ? {
              scale: [1, 1.02, 1],
              backgroundColor: ["rgba(255,255,255,0.2)", "rgba(34,197,94,0.2)", "rgba(255,255,255,0.2)"]
            } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              animate={celebratingTasks.has(task.id) ? {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleTaskToggle(task.id)}
                id={`checkbox-${task.id}`}
                className="mt-1"
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="relative inline-block w-full">
                <motion.div
                  animate={justCompletedTasks.has(task.id) ? {
                    y: [0, -2, 0],
                  } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Label 
                    htmlFor={`checkbox-${task.id}`}
                    className={`text-sm font-medium cursor-pointer block transition-colors duration-300 ${
                      task.completed ? 'text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </Label>
                </motion.div>
                <motion.svg
                  width="100%"
                  height="32"
                  viewBox="0 0 340 32"
                  className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-20 w-full h-8"
                >
                  <motion.path
                    d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeMiterlimit={10}
                    fill="none"
                    initial={false}
                    animate={getPathAnimate(!!task.completed)}
                    transition={getPathTransition(!!task.completed)}
                    className="stroke-neutral-900 dark:stroke-neutral-100"
                  />
                </motion.svg>
              </div>
              
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <motion.div
                  animate={celebratingTasks.has(task.id) ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className={`text-xs transition-all duration-300 ${getPriorityColor(task.priority)} ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    {task.priority}
                  </Badge>
                </motion.div>
                
                {task.dueDate && (
                  <div className={`flex items-center text-xs ${
                    isOverdue(task.dueDate) 
                      ? 'text-red-600 font-medium' 
                      : 'text-muted-foreground'
                  }`}>
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatRelativeTime(task.dueDate)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Celebration Effects */}
            <AnimatePresence>
              {celebratingTasks.has(task.id) && (
                <>
                  <SuccessMessage />
                  {/* Confetti particles */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <ConfettiParticle key={i} delay={i * 0.1} />
                  ))}
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-2 -right-2 text-yellow-400"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1, 0], 
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-50 hover:opacity-100 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEditTask(task)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteTask(task)}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
          {idx !== tasks.length - 1 && (
            <div className="border-t border-white/50 dark:border-neutral-700" />
          )}
        </div>
      ))}
    </div>
  );
}

export { PlayfulBoardTodolist };