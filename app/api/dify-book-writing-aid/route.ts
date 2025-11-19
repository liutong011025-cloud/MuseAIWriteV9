import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const DIFY_API_KEY = process.env.DIFY_API_KEY || ''
const DIFY_BOOK_WRITING_AID_APP_ID = 'app-9Qbo41jL3RuXmArfN7doaHvl'
const DIFY_BASE_URL = 'https://api.dify.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { text, reviewType, bookTitle, structure, currentSection, user_id } = await request.json()

    if (!text || !reviewType || !bookTitle) {
      return NextResponse.json(
        { error: 'Text, review type, and book title are required' },
        { status: 400 }
      )
    }

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      )
    }

    // 获取当前section名称
    const currentSectionName = currentSection !== undefined ? structure?.outline?.[currentSection] || '' : ''

    // 构建查询消息（用英语，简短、可爱，带emoji）
    // 设定：你是小学英语bookreview写作老师，根据学生的写作提出建议
    const queryMessage = `You are an elementary school English book review writing teacher. 
The student is writing a ${reviewType} review for the book "${bookTitle}". 
They are currently working on the "${currentSectionName}" section.
Here's what they've written so far: "${text || ''}"

Please provide brief, cute suggestions in English with emojis. When you think this section is well-written and complete, end your response with: "you can move to the next part".`

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
        current_section: currentSectionName,
        student_writing: text || '',
      },
      query: queryMessage,
      response_mode: 'blocking',
      user: user_id || 'default-user',
      app_id: DIFY_BOOK_WRITING_AID_APP_ID, // 指定使用正确的机器人
    }

    console.log('Dify Book Writing Aid API Request:', JSON.stringify({
      url,
      app_id: DIFY_BOOK_WRITING_AID_APP_ID,
      review_type: reviewType,
      book_title: bookTitle,
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
    // Dify API 可能返回 answer 或 message 字段
    const message = data.answer || data.message || data.text || ''

    // 记录API调用
    await logApiCall(
      user_id || 'default-user',
      'bookReviewWriting',
      '/api/dify-book-writing-aid',
      { text, reviewType, bookTitle, structure, currentSection },
      { answer: message, conversation_id: data.conversation_id, message_id: data.id }
    )

    return NextResponse.json({
      message,
      conversationId: data.conversation_id,
      messageId: data.id,
    })
  } catch (error) {
    console.error('Book writing aid API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

