import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const DIFY_API_KEY = process.env.DIFY_API_KEY || ''
const DIFY_LETTER_APP_ID = 'app-3iAjb8MCQEXkUxcjvky6lhXt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, occasion, currentSection, currentText, user_id } = body

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      )
    }

    // 构建友好的提示词 - 真实的 Muse AI 评价
    const queryMessage = `You are Muse, a friendly and encouraging letter writing teacher for elementary school students.

A student is writing a letter:
- To: "${recipient}"
- Reason: "${occasion}"
- Current section: "${currentSection}"
- What they've written so far: "${currentText || 'Just starting...'}"

IMPORTANT RULES:
1. Provide brief, kid-friendly feedback (2-3 sentences max)
2. Use emojis to make it fun! ✨
3. Be warm, supportive, and encouraging
4. CRITICAL: If the current section is complete and good enough, you MUST end your response with exactly this phrase: "you can move to the next part"
   - The section is complete when:
     - It has enough content (at least 2-3 sentences or meaningful content)
     - The writing is appropriate and makes sense
     - The student has put in real effort
5. If the writing is too short, unclear, or needs improvement, provide helpful suggestions but DO NOT include "you can move to the next part" in your response
6. Be honest but kind - only approve when the writing is genuinely good enough for an elementary student

Remember: When the section is complete, you MUST end your response with "you can move to the next part" so the student can proceed to the next section automatically.

Provide your feedback now:`

    const response = await fetch(`https://api.dify.ai/v1/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: queryMessage,
        response_mode: 'blocking',
        conversation_id: '',
        user: user_id || 'student',
        app_id: DIFY_LETTER_APP_ID, // 指定使用正确的机器人
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API error:', response.status, errorText)
      throw new Error(`Dify API error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.answer || data.message || data.text || "Keep writing! You're doing great! ✨"

    // 记录 API 调用
    try {
      await logApiCall(
        user_id,
        'letterGuide',
        '/api/dify-letter-guide',
        { recipient, occasion, currentSection },
        { message }
      )
    } catch (logError) {
      console.error('Error logging API call:', logError)
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error in letter guide API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

