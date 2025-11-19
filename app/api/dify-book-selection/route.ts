import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const DIFY_API_KEY = process.env.DIFY_API_KEY || ''
const DIFY_BOOK_SELECTION_APP_ID = 'app-EnHszR7uaCnOh1EWb7INdemd'
const DIFY_BASE_URL = 'https://api.dify.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { reviewType, bookTitle, conversation, conversation_id, user_id } = await request.json()

    if (!reviewType || !bookTitle) {
      return NextResponse.json(
        { error: 'Review type and book title are required' },
        { status: 400 }
      )
    }

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      )
    }

    // 构建查询消息，包含review类型和书名
    const queryMessage = `The student wants to write a ${reviewType} review for the book: ${bookTitle}. Please help them select this book and guide them. When appropriate, you can say "Let's start writing" to indicate they can proceed.`

    // Dify API configuration
    const url = `${DIFY_BASE_URL}/chat-messages`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIFY_API_KEY}`,
    }
    
    const requestBody: any = {
      inputs: {
        review_type: reviewType,
        book_title: bookTitle,
      },
      query: queryMessage,
      response_mode: 'blocking',
      conversation_id: conversation_id || undefined,
      user: user_id || 'default-user',
      app_id: DIFY_BOOK_SELECTION_APP_ID, // 指定使用正确的机器人
    }

    console.log('Dify Book Selection API Request:', JSON.stringify({
      url,
      app_id: DIFY_BOOK_SELECTION_APP_ID,
      review_type: reviewType,
      book_title: bookTitle,
      has_conversation_id: !!conversation_id,
    }, null, 2))

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API error:', errorText)
      return NextResponse.json(
        { error: `Dify API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const message = data.answer || data.message || ''

    // 记录API调用
    await logApiCall(
      user_id || 'default-user',
      'bookSelection',
      '/api/dify-book-selection',
      { reviewType, bookTitle, conversation_id },
      { answer: message, conversation_id: data.conversation_id, message_id: data.id }
    )

    return NextResponse.json({
      message,
      conversationId: data.conversation_id,
      messageId: data.id,
    })
  } catch (error) {
    console.error('Book selection API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

