import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const FAL_KEY = process.env.FAL_KEY || ''
const FAL_API_ENDPOINT = 'https://fal.run/fal-ai/nano-banana'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const bookTitle = body.bookTitle
    const userId = body.user_id

    if (!bookTitle || typeof bookTitle !== 'string' || bookTitle.trim() === '') {
      return NextResponse.json(
        { error: 'Book title cannot be empty' },
        { status: 400 }
      )
    }

    if (!FAL_KEY) {
      return NextResponse.json(
        { error: 'FAL_KEY not configured. Please set FAL_KEY in .env.local' },
        { status: 500 }
      )
    }

    // 生成拟真风格的书封面，正对视角，不倾斜
    const prompt = `Professional book cover for "${bookTitle}". Realistic hardcover book, front view, straight perspective, no tilt or angle. Elegant typography on front cover, realistic textures, bookstore quality, professional book design.`

    const requestBody = {
      prompt: prompt.trim(),
      num_images: 1,
      output_format: 'jpeg',
      aspect_ratio: '2:3', // 书封面比例
      sync_mode: true,
    }

    console.log('Generating book cover for:', bookTitle)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch(FAL_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${FAL_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Fal.ai API error:', response.status, errorData)
        return NextResponse.json(
          { error: `Failed to generate book cover (${response.status}): ${errorData}` },
          { status: response.status }
        )
      }

      const result = await response.json()
      const imageUrl = result.images?.[0]?.url || null

      if (!imageUrl) {
        return NextResponse.json(
          { error: 'Failed to get image URL from response' },
          { status: 500 }
        )
      }

      // 记录API调用
      await logApiCall(
        userId,
        'bookReviewWriting',
        '/api/generate-book-cover (Fal.ai)',
        { bookTitle },
        { imageUrl }
      )

      return NextResponse.json({ 
        imageUrl,
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Image generation timeout. Please try again.' },
          { status: 504 }
        )
      }
      throw fetchError
    }

  } catch (error) {
    console.error('Error generating book cover:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    )
  }
}

