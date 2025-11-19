"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface BookReviewLoadingProps {
  reviewType: "recommendation" | "critical" | "literary"
  bookTitle: string
  structure: {
    type: "recommendation" | "critical" | "literary"
    outline: string[]
  }
  onCoverReady: (bookCoverUrl: string, bookSummary: string) => void
  onBack: () => void
}

const WRITING_TIPS = {
  recommendation: {
    title: "Writing Tips for Recommendation Review",
    tips: [
      "✨ Start with what made you pick up this book - hook your readers!",
      "💝 Share specific parts you loved (characters, plot twists, emotions)",
      "🌟 Be genuine - tell readers why YOU think they should read it",
      "📚 Mention who might enjoy this book (age, interests, reading style)",
      "🎯 End with a clear recommendation that makes readers excited!",
    ],
    color: "from-blue-500 via-indigo-500 to-purple-500",
  },
  critical: {
    title: "Writing Tips for Critical Review",
    tips: [
      "🔍 Look at both strengths AND weaknesses - be fair and balanced",
      "💪 Mention what worked well (characters, writing style, themes)",
      "⚠️ Point out what didn't work (plot holes, pacing, confusing parts)",
      "📝 Use examples from the book to support your points",
      "🎯 Give an honest overall assessment - what's your final verdict?",
    ],
    color: "from-orange-500 via-red-500 to-pink-500",
  },
  literary: {
    title: "Writing Tips for Literary Review",
    tips: [
      "📖 Explore the deeper meanings - what themes does the book explore?",
      "🎨 Look for symbols, metaphors, and literary devices the author uses",
      "👥 Analyze how characters develop and what they represent",
      "✍️ Examine the writing style - how does the author craft sentences?",
      "💭 Connect the book's message to bigger ideas about life and society",
    ],
    color: "from-purple-500 via-pink-500 to-rose-500",
  },
}

export default function BookReviewLoading({
  reviewType,
  bookTitle,
  structure,
  onCoverReady,
  onBack,
}: BookReviewLoadingProps) {
  const tips = WRITING_TIPS[reviewType]

  useEffect(() => {
    const generateCoverAndSummary = async () => {
      try {
        // 同时生成封面和书摘要
        const [coverResponse, summaryResponse] = await Promise.all([
          fetch("/api/generate-book-cover", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookTitle, user_id: 'student' }),
          }),
          fetch("/api/dify-book-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookTitle, user_id: 'student' }),
          })
        ])

        if (!coverResponse.ok) {
          const errorData = await coverResponse.json().catch(() => ({}))
          console.error("Book cover generation failed:", coverResponse.status, errorData)
        }
        
        const coverData = coverResponse.ok ? await coverResponse.json() : { imageUrl: "", error: "Failed to generate cover" }
        const summaryData = summaryResponse.ok ? await summaryResponse.json() : { message: "" }

        // 生成后直接跳转，传递封面URL和书摘要
        onCoverReady(coverData.imageUrl || "", summaryData.message || "")
      } catch (error) {
        console.error("Error generating cover or summary:", error)
        // 生成失败也跳转
        onCoverReady("", "")
      }
    }

    generateCoverAndSummary()
  }, [bookTitle, onCoverReady])

  return (
    <div className="h-screen py-6 px-6 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 relative overflow-hidden" style={{ overflowY: 'hidden' }}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 h-full flex flex-col" style={{ paddingTop: '60px', maxHeight: 'calc(100vh - 60px)' }}>
        {/* 返回按钮 */}
        {onBack && (
          <div className="mb-4 flex-shrink-0">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/80 backdrop-blur-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg font-bold rounded-lg transition-all text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Preparing Your Writing Space
          </h1>
          <p className="text-base text-gray-600 mb-2">
            Reviewing: <strong>{bookTitle}</strong>
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex-1 flex items-center justify-center">
          {/* 写作秘诀 - 向右填充，占据更大空间 */}
          <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-8 border-4 border-purple-300 shadow-2xl backdrop-blur-sm relative w-full">
            {/* 加载转圈 - 放在右上角 */}
            <div className="absolute top-6 right-6">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>

            <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${tips.color} bg-clip-text text-transparent pr-16`}>
              {tips.title}
            </h2>
            <div className="space-y-3 pr-16">
              {tips.tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/90 rounded-xl p-4 border-2 border-purple-200 shadow-lg backdrop-blur-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-base text-gray-800 leading-relaxed" style={{ fontFamily: 'var(--font-comic-neue)' }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            {/* 结构预览 */}
            <div className="mt-6 bg-white/90 rounded-xl p-5 border-2 border-purple-200 shadow-lg pr-16">
              <h3 className="text-lg font-bold text-purple-700 mb-3">Your Review Structure:</h3>
              <div className="space-y-2">
                {structure.outline.map((section, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <span className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

