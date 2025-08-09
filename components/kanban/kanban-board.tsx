"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddBoardDialog } from "./add-board-dialog";
import { AddTaskDialog } from "./add-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { EditBoardDialog } from "./edit-board-dialog";
import { DeleteBoardDialog } from "./delete-board-dialog";
import { PlayfulBoardTodolist } from "./playful-board-todolist";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  completed: boolean;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export function KanbanBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddBoard, setShowAddBoard] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Load boards from API
  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const response = await fetch("/api/boards", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBoards(data.boards);
      }
    } catch (error) {
      console.error("Failed to load boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBoard = async (title: string, color: string) => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, color }),
      });

      if (response.ok) {
        const data = await response.json();
        setBoards([...boards, data.board]);
      }
    } catch (error) {
      console.error("Failed to add board:", error);
    }
  };

  const addTask = async (
    boardId: string,
    task: Omit<Task, "id" | "createdAt" | "completed">
  ) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ boardId, ...task }),
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(
          boards.map((board) =>
            board.id === boardId
              ? { ...board, tasks: [...board.tasks, data.task] }
              : board
          )
        );
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (boardId: string, taskId: string) => {
    // Optimistically update UI
    const updatedBoards = boards.map((board) =>
      board.id === boardId
        ? {
            ...board,
            tasks: board.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
          }
        : board
    );
    setBoards(updatedBoards);

    // Find the updated task
    const board = updatedBoards.find((b) => b.id === boardId);
    const task = board?.tasks.find((t) => t.id === taskId);

    if (task) {
      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ boardId, taskId, completed: task.completed }),
        });
      } catch (error) {
        console.error("Failed to toggle task:", error);
        // Revert on error
        loadBoards();
      }
    }
  };

  const handleAddTask = (boardId: string) => {
    setSelectedBoardId(boardId);
    setShowAddTask(true);
  };

  const handleEditTask = (boardId: string, task: Task) => {
    setSelectedBoardId(boardId);
    setSelectedTask(task);
    setShowEditTask(true);
  };

  const handleDeleteTask = (boardId: string, task: Task) => {
    setSelectedBoardId(boardId);
    setSelectedTask(task);
    setShowDeleteTask(true);
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          boardId: selectedBoardId,
          taskId: updatedTask.id,
          ...updatedTask,
        }),
      });

      if (response.ok) {
        setBoards(
          boards.map((board) =>
            board.id === selectedBoardId
              ? {
                  ...board,
                  tasks: board.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                  ),
                }
              : board
          )
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async () => {
    if (selectedTask) {
      try {
        const response = await fetch(
          `/api/tasks?boardId=${selectedBoardId}&taskId=${selectedTask.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          setBoards(
            boards.map((board) =>
              board.id === selectedBoardId
                ? {
                    ...board,
                    tasks: board.tasks.filter(
                      (task) => task.id !== selectedTask.id
                    ),
                  }
                : board
            )
          );
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Board management functions
  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setShowEditBoard(true);
  };

  const handleDeleteBoard = (board: Board) => {
    setSelectedBoard(board);
    setShowDeleteBoard(true);
  };

  const updateBoard = async (updatedBoard: Board) => {
    try {
      const response = await fetch(`/api/boards/${updatedBoard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: updatedBoard.title,
          color: updatedBoard.color
        }),
      });

      if (response.ok) {
        setBoards(
          boards.map((board) =>
            board.id === updatedBoard.id ? updatedBoard : board
          )
        );
      }
    } catch (error) {
      console.error('Failed to update board:', error);
    }
  };

  const deleteBoard = async () => {
    if (selectedBoard) {
      try {
        const response = await fetch(`/api/boards/${selectedBoard.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          setBoards(boards.filter(board => board.id !== selectedBoard.id));
        }
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Applyo Task Board</h2>
          <p className="text-muted-foreground">
            Organize your tasks across different stages
          </p>
        </div>
        <Button onClick={() => setShowAddBoard(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Board
        </Button>
      </div>

      {boards.length === 0 ? (
        // Empty state when no boards
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">No boards yet</h3>
              <p className="text-gray-500">
                Create your first board to start organizing your tasks. You can create boards for different projects, categories, or workflows.
              </p>
            </div>
            <Button onClick={() => setShowAddBoard(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Board
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {boards.map((board) => (
          <div key={board.id} className="flex-shrink-0 w-80">
            <Card className={`group ${board.color} border-0`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {board.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/50">
                      {board.tasks.length}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEditBoard(board)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit board
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteBoard(board)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete board
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <PlayfulBoardTodolist
                  tasks={board.tasks}
                  onToggleTask={(taskId) => toggleTask(board.id, taskId)}
                  onEditTask={(task) => handleEditTask(board.id, task)}
                  onDeleteTask={(task) => handleDeleteTask(board.id, task)}
                />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground mt-4"
                  onClick={() => handleAddTask(board.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add task
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
        </div>
      )}

      <AddBoardDialog
        open={showAddBoard}
        onOpenChange={setShowAddBoard}
        onAddBoard={addBoard}
      />

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onAddTask={(task) => addTask(selectedBoardId, task)}
      />

      <EditTaskDialog
        open={showEditTask}
        onOpenChange={setShowEditTask}
        onUpdateTask={updateTask}
        task={selectedTask}
      />

      <DeleteTaskDialog
        open={showDeleteTask}
        onOpenChange={setShowDeleteTask}
        onDeleteTask={deleteTask}
        task={selectedTask}
      />

      <EditBoardDialog
        open={showEditBoard}
        onOpenChange={setShowEditBoard}
        onUpdateBoard={updateBoard}
        board={selectedBoard}
      />

      <DeleteBoardDialog
        open={showDeleteBoard}
        onOpenChange={setShowDeleteBoard}
        onDeleteBoard={deleteBoard}
        board={selectedBoard}
      />
    </div>
  );
}
