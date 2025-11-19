import { NextRequest, NextResponse } from 'next/server'

const FAL_KEY = process.env.FAL_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, occasion } = body

    if (!FAL_KEY) {
      return NextResponse.json(
        { error: 'FAL_KEY not configured' },
        { status: 500 }
      )
    }

    // 使用 fal.ai 生成收信人读信的照片
    const prompt = `A person reading a letter, recipient: ${recipient}, occasion: ${occasion}, warm and friendly atmosphere, realistic photo style`

    const response = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: 'square',
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fal.ai API error:', response.status, errorText)
      // 返回 null 而不是抛出错误，允许继续使用
      return NextResponse.json({ imageUrl: null })
    }

    const data = await response.json()
    
    // fal.ai 返回格式可能是 { images: [{ url: ... }] } 或 { image: { url: ... } } 或直接 { url: ... }
    let imageUrl = null
    
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      imageUrl = data.images[0].url || data.images[0]
    } else if (data.image && data.image.url) {
      imageUrl = data.image.url
    } else if (data.url) {
      imageUrl = data.url
    } else if (typeof data === 'string') {
      imageUrl = data
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating letter reader image:', error)
    // 返回 null 而不是抛出错误
    return NextResponse.json({ imageUrl: null })
  }
}


