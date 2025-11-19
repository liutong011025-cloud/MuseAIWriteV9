import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const DIFY_API_KEY = process.env.DIFY_API_KEY || ''
const DIFY_PLOT_SUMMARY_APP_ID = 'app-HgMPyyxKQNPk2ZZP6znDalkp'
const DIFY_BASE_URL = 'https://api.dify.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { conversation_history, conversation_id, user_id } = await request.json()

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      )
    }

    // 构建对话历史文本（作为输入变量）
    const conversationText = conversation_history
      .map((msg: { role: string; content: string }) => {
        const role = msg.role === 'user' ? 'Student' : 'AI'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')

    if (!conversationText || conversationText.trim() === '') {
      return NextResponse.json(
        { error: 'No conversation history provided' },
        { status: 400 }
      )
    }

    console.log('Plot Summary - Conversation history:', conversationText)
    console.log('Plot Summary - Conversation history length:', conversationText.length)

    // Dify API configuration - 直接将对话历史传递给总结机器人
    const url = `${DIFY_BASE_URL}/chat-messages`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIFY_API_KEY}`,
    }
    
    // 总结机器人的设定：监视对话并提取Setting、Conflict、Goal
    // 将完整对话历史作为查询的一部分，确保AI能看到所有对话内容
    const queryMessage = `Please analyze the following conversation between a student and an AI about creating a story plot, and summarize the Setting, Conflict, and Goal:

${conversationText}

Only respond if there is enough information in the conversation to determine all three (Setting, Conflict, and Goal). Format your response exactly as:
setting: [setting]
conflict: [conflict]
goal: [goal]

When each part (setting, conflict, and goal) is clear and complete, you can output "done" on a new line.`
    
    const requestBody: any = {
      inputs: {
        conversation: conversationText, // 对话历史作为输入变量（如果Dify机器人需要）
      },
      query: queryMessage, // 查询消息包含完整对话，确保AI能看到
      response_mode: 'blocking',
      conversation_id: conversation_id || undefined, // 使用conversation_id保持总结机器人的对话上下文
      user: user_id || 'default-user',
      app_id: DIFY_PLOT_SUMMARY_APP_ID, // 指定使用正确的机器人
    }
    
    console.log('Plot Summary API Request:', JSON.stringify({
      url,
      app_id: DIFY_PLOT_SUMMARY_APP_ID,
      has_conversation_id: !!conversation_id,
      conversation_length: conversationText.length,
    }, null, 2))

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify Plot Summary API error:', errorText)
      return NextResponse.json(
        { error: `Dify API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Plot Summary - AI Response:', data.answer)
    
    // 记录API调用
    await logApiCall(
      user_id,
      'plot',
      '/api/dify-plot-summary',
      { conversation_history, conversation_id },
      { summary: data.answer, conversation_id: data.conversation_id }
    )
    
    return NextResponse.json({
      summary: data.answer || '',
      conversation_id: data.conversation_id, // 返回conversation_id，以便后续调用使用
    })
  } catch (error) {
    console.error('Error calling Dify Plot Summary API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

