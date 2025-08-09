import { Task, Board } from "@/components/kanban/kanban-board";

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface UserData {
  user: User;
  boards: Board[];
}

// In-memory database
class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private userBoards: Map<string, Board[]> = new Map();

  // User methods
  createUser(user: User): void {
    this.users.set(user.id, user);
    this.userBoards.set(user.id, this.getDefaultBoards(user.id));
  }

  getUserByEmail(email: string): User | null {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  // Board methods
  getUserBoards(userId: string): Board[] {
    return this.userBoards.get(userId) || [];
  }

  updateUserBoards(userId: string, boards: Board[]): void {
    this.userBoards.set(userId, boards);
  }

  addBoard(userId: string, board: Board): void {
    const boards = this.getUserBoards(userId);
    boards.push(board);
    this.updateUserBoards(userId, boards);
  }

  updateBoard(userId: string, boardId: string, updatedBoard: Board): void {
    const boards = this.getUserBoards(userId);
    const index = boards.findIndex((b) => b.id === boardId);
    if (index !== -1) {
      boards[index] = updatedBoard;
      this.updateUserBoards(userId, boards);
    }
  }

  deleteBoard(userId: string, boardId: string): void {
    const boards = this.getUserBoards(userId);
    const filteredBoards = boards.filter((b) => b.id !== boardId);
    this.updateUserBoards(userId, filteredBoards);
  }

  // Task methods
  addTask(userId: string, boardId: string, task: Task): void {
    const boards = this.getUserBoards(userId);
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      board.tasks.push(task);
      this.updateUserBoards(userId, boards);
    }
  }

  updateTask(
    userId: string,
    boardId: string,
    taskId: string,
    updatedTask: Task
  ): void {
    const boards = this.getUserBoards(userId);
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      const taskIndex = board.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        board.tasks[taskIndex] = updatedTask;
        this.updateUserBoards(userId, boards);
      }
    }
  }

  deleteTask(userId: string, boardId: string, taskId: string): void {
    const boards = this.getUserBoards(userId);
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      board.tasks = board.tasks.filter((t) => t.id !== taskId);
      this.updateUserBoards(userId, boards);
    }
  }

  private getDefaultBoards(userId: string): Board[] {
    return [
      {
        id: `${userId}-1`,
        title: "Groceries 🛒",
        color: "bg-emerald-100",
        tasks: [
          {
            id: `${userId}-task-1`,
            title: "Buy fresh vegetables 🥕",
            description: "Carrots, broccoli, and spinach",
            dueDate: "2025-08-10T18:00",
            priority: "high",
            createdAt: "2025-08-09",
            completed: false,
          },
          {
            id: `${userId}-task-2`,
            title: "Get milk and eggs 🥛",
            dueDate: "2025-08-11T10:30",
            priority: "medium",
            createdAt: "2025-08-09",
            completed: false,
          },
        ],
      },
      {
        id: `${userId}-2`,
        title: "Work 💼",
        color: "bg-sky-100",
        tasks: [
          {
            id: `${userId}-task-3`,
            title: "Finish quarterly report 📊",
            description: "Complete Q3 performance analysis",
            dueDate: "2025-08-12T17:00",
            priority: "high",
            createdAt: "2025-08-08",
            completed: false,
          },
        ],
      },
      {
        id: `${userId}-3`,
        title: "Learning 📚",
        color: "bg-violet-100",
        tasks: [
          {
            id: `${userId}-task-4`,
            title: "Complete React course chapter 5 ⚛️",
            description: "Learn about hooks and state management",
            dueDate: "2025-08-15T14:30",
            priority: "medium",
            createdAt: "2025-08-09",
            completed: false,
          },
        ],
      },
    ];
  }

  // Debug methods
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getAllUserBoards(): Map<string, Board[]> {
    return this.userBoards;
  }
}

// Singleton instance
export const database = new InMemoryDatabase();
