import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { AuthService } from '@/lib/auth'
import { Task } from '@/components/kanban/kanban-board'

// Create new task
export async function POST(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthService.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { boardId, title, description, dueDate, priority } = body

    if (!boardId || !title) {
      return NextResponse.json(
        { error: 'Board ID and title are required' },
        { status: 400 }
      )
    }

    // Create new task
    const newTask: Task = {
      id: `${payload.userId}-task-${Date.now()}`,
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      createdAt: new Date().toISOString().split('T')[0],
      completed: false
    }

    database.addTask(payload.userId, boardId, newTask)

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update task
export async function PUT(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthService.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { boardId, taskId, ...taskUpdates } = body

    if (!boardId || !taskId) {
      return NextResponse.json(
        { error: 'Board ID and task ID are required' },
        { status: 400 }
      )
    }

    // Get current task
    const boards = database.getUserBoards(payload.userId)
    const board = boards.find(b => b.id === boardId)
    const currentTask = board?.tasks.find(t => t.id === taskId)

    if (!currentTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Update task
    const updatedTask: Task = {
      ...currentTask,
      ...taskUpdates
    }

    database.updateTask(payload.userId, boardId, taskId, updatedTask)

    return NextResponse.json({ task: updatedTask }, { status: 200 })
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete task
export async function DELETE(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthService.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get('boardId')
    const taskId = searchParams.get('taskId')

    if (!boardId || !taskId) {
      return NextResponse.json(
        { error: 'Board ID and task ID are required' },
        { status: 400 }
      )
    }

    database.deleteTask(payload.userId, boardId, taskId)

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}