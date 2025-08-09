import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { AuthService } from '@/lib/auth'
import { Board } from '@/components/kanban/kanban-board'

// Get user boards
export async function GET(request: NextRequest) {
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

    // Get user boards
    const boards = database.getUserBoards(payload.userId)

    return NextResponse.json({ boards }, { status: 200 })
  } catch (error) {
    console.error('Get boards error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new board
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
    const { title, color } = body

    if (!title || !color) {
      return NextResponse.json(
        { error: 'Title and color are required' },
        { status: 400 }
      )
    }

    // Create new board
    const newBoard: Board = {
      id: `${payload.userId}-board-${Date.now()}`,
      title,
      color,
      tasks: []
    }

    database.addBoard(payload.userId, newBoard)

    return NextResponse.json({ board: newBoard }, { status: 201 })
  } catch (error) {
    console.error('Create board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}