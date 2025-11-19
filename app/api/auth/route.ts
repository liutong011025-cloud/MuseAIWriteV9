import { NextRequest, NextResponse } from 'next/server'

// 简单的用户数据库（实际应用中应该使用真实的数据库）
const USERS = {
  'Nicole': { password: 'yinyin2948', role: 'teacher' as const },
  'Stark': { password: '123321', role: 'student' as const },
  'halk': { password: '123321', role: 'student' as const },
  'Rogers': { password: '123321', role: 'student' as const, noAi: true }, // 无AI版本
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = USERS[username as keyof typeof USERS]
    
    if (user && user.password === password) {
      // 用户存在且密码正确
      return NextResponse.json({
        success: true,
        user: {
          username,
          role: user.role,
          noAi: (user as any).noAi || false, // 标记是否为无AI版本
        },
      })
    }

    // 用户名或密码错误
    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

