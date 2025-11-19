"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"
import StageHeader from "@/components/stage-header"

interface BookReviewWritingNoAiProps {
  reviewType: "recommendation" | "critical" | "literary"
  bookTitle: string
  structure: {
    type: "recommendation" | "critical" | "literary"
    outline: string[]
  }
  initialCoverUrl?: string
  onReviewWrite: (review: string, bookCoverUrl?: string) => void
  onBack: () => void
  userId?: string
}

// Enhanced word count function that handles both English and Chinese
const countWords = (text: string): number => {
  if (!text || !text.trim()) return 0
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const englishText = text.replace(/[\u4e00-\u9fff]/g, ' ').trim()
  const englishWords = englishText ? englishText.split(/\s+/).filter(word => word.length > 0).length : 0
  return chineseChars + englishWords
}

export default function BookReviewWritingNoAi({ 
  reviewType, 
  bookTitle, 
  structure,
  initialCoverUrl = undefined,
  onReviewWrite, 
  onBack, 
  userId 
}: BookReviewWritingNoAiProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionTexts, setSectionTexts] = useState<Record<number, string>>({})
  const [bookCoverUrl] = useState<string | null>(initialCoverUrl || null)

  const sections = structure?.outline || []
  const currentSectionText = sectionTexts[currentSection] || ""

  const wordCount = useMemo(() => {
    const allText = Object.values(sectionTexts).join(' ')
    return countWords(allText)
  }, [sectionTexts])

  const handleSectionTextChange = (sectionIndex: number, text: string) => {
    setSectionTexts(prev => ({
      ...prev,
      [sectionIndex]: text
    }))
  }

  const handlePublish = async () => {
    // 检查是否有任何section包含"test"文本（跳过字数限制）
    const hasTestText = Object.values(sectionTexts).some(text => 
      text.trim().toLowerCase().includes('test')
    )
    
    if (!hasTestText && wordCount < 50) {
      toast.error("Your review needs at least 50 words")
      return
    }

    const fullReview = sections.map((_, index) => {
      const sectionText = sectionTexts[index] || ""
      return `${sections[index]}:\n${sectionText}`
    }).join('\n\n')

    // 保存到后端（类似story-review.tsx）
    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || "default-user",
          stage: "bookReviewComplete",
          type: "bookReview",
          data: {
            review: fullReview,
            reviewType,
            bookTitle,
            bookCoverUrl: bookCoverUrl || undefined,
          },
          review: fullReview,
          reviewType,
          bookTitle,
          bookCoverUrl: bookCoverUrl || undefined,
        }),
      })
    } catch (error) {
      console.error("Error saving review:", error)
    }

    onReviewWrite(fullReview, bookCoverUrl || undefined)
  }

  const handleSectionChange = (index: number) => {
    if (index === currentSection) return
    setCurrentSection(index)
  }

  const reviewTypeNames = {
    recommendation: "Recommendation Review",
    critical: "Critical Review",
    literary: "Literary Review",
  }

  return (
    <div className="min-h-screen py-6 px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <StageHeader onBack={onBack} />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Write Your Book Review
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            <span className="font-bold">{reviewTypeNames[reviewType]}</span> for <span className="font-bold italic">{bookTitle}</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Word Count Display */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border-2 border-purple-200 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-700 mb-2">{wordCount}</p>
                <p className="text-sm text-gray-600">words written</p>
              </div>
            </div>
          </div>

          {/* Main Writing Area */}
          <div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
              {/* Section Navigation */}
              <div className="mb-6">
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {sections.map((section, i) => (
                    <button
                      key={i}
                      onClick={() => handleSectionChange(i)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-lg transform hover:scale-105 ${
                        currentSection === i
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 ring-4 ring-purple-300"
                          : "bg-white border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:shadow-md"
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Section Writing */}
              <div className="mb-6">
                <label className="block text-xl font-bold mb-4 text-purple-700">
                  {sections[currentSection]}
                </label>
                <textarea
                  value={currentSectionText}
                  onChange={(e) => handleSectionTextChange(currentSection, e.target.value)}
                  placeholder={`Write your ${sections[currentSection]} here...`}
                  className="w-full min-h-[300px] p-4 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:outline-none resize-y text-base"
                  style={{ fontFamily: 'var(--font-comic-neue)' }}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {countWords(currentSectionText)} words in this section
                </p>
              </div>

              {/* Publish Button */}
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handlePublish}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-xl py-6 px-12 text-lg font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Finish Review ✨
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

