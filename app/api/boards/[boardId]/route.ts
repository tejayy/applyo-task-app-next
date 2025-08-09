import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { AuthService } from '@/lib/auth'

// Update board
export async function PUT(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
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
    const boardId = params.boardId

    if (!title || !color) {
      return NextResponse.json(
        { error: 'Title and color are required' },
        { status: 400 }
      )
    }

    // Get current boards
    const boards = database.getUserBoards(payload.userId)
    const boardIndex = boards.findIndex(b => b.id === boardId)

    if (boardIndex === -1) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Update board
    const updatedBoard = {
      ...boards[boardIndex],
      title,
      color
    }

    boards[boardIndex] = updatedBoard
    database.updateUserBoards(payload.userId, boards)

    return NextResponse.json({ board: updatedBoard }, { status: 200 })
  } catch (error) {
    console.error('Update board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete board
export async function DELETE(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
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

    const boardId = params.boardId

    // Delete board
    database.deleteBoard(payload.userId, boardId)

    return NextResponse.json({ message: 'Board deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}