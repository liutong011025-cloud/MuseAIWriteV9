import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, recipient, occasion, letter, user_id } = body

    if (!to || !recipient || !letter) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 这里应该使用真实的邮件服务（如 SendGrid, Resend, Nodemailer 等）
    // 为了演示，我们只是记录日志并返回成功
    console.log('Email would be sent:', {
      to,
      subject: `Letter from MuseAIWrite: To ${recipient}`,
      body: `Letter to: ${recipient}\nOccasion: ${occasion}\n\n${letter}`,
    })

    // 记录 API 调用
    try {
      await logApiCall(
        user_id,
        'sendLetterEmail',
        '/api/send-letter-email',
        { to, recipient, occasion },
        { success: true }
      )
    } catch (logError) {
      console.error('Error logging API call:', logError)
    }

    // 在实际应用中，这里应该调用真实的邮件服务
    // 例如：
    // const emailService = new EmailService()
    // await emailService.send({
    //   to,
    //   subject: `Letter from MuseAIWrite: To ${recipient}`,
    //   html: `<p>Letter to: ${recipient}</p><p>Occasion: ${occasion}</p><pre>${letter}</pre>`,
    // })

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (simulated)',
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


