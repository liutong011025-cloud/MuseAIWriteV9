"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface WriteTypeSelectionProps {
  onSelectStory?: () => void
  onSelectBookReview?: () => void
  onSelectLetter?: () => void
  onBack?: () => void
}

const writingTypes = [
  {
    id: "story",
    title: "Story Writing",
    icon: "📖",
    description: "Create magical stories with help from your AI mentor",
    gradient: "from-purple-600 via-pink-600 to-orange-600",
    hoverGradient: "from-purple-700 via-pink-700 to-orange-700",
    borderColor: "border-purple-200",
    features: [
      "Create unique characters",
      "Build exciting plots",
      "Write amazing adventures",
      "Share your imagination"
    ],
    prompt: "Once upon a time..."
  },
  {
    id: "bookReview",
    title: "Book Review",
    icon: "📝",
    description: "Write thoughtful book reviews with AI assistance",
    gradient: "from-blue-600 to-cyan-600",
    hoverGradient: "from-blue-700 to-cyan-700",
    borderColor: "border-blue-200",
    features: [
      "Share your opinions",
      "Give reasons and examples",
      "Help others find great books",
      "Practice critical thinking"
    ],
    prompt: "This book is great because..."
  },
  {
    id: "letter",
    title: "Letter Writing",
    icon: "✉️",
    description: "Compose letters with creative writing support",
    gradient: "from-green-600 to-emerald-600",
    hoverGradient: "from-green-700 to-emerald-700",
    borderColor: "border-green-200",
    features: [
      "Express your feelings",
      "Share real experiences",
      "Connect with friends",
      "Practice friendly tone"
    ],
    prompt: "Hi! Guess what I did today?"
  }
]

export default function WriteTypeSelection({ 
  onSelectStory, 
  onSelectBookReview, 
  onSelectLetter,
  onBack 
}: WriteTypeSelectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleSelect = (type: string) => {
    if (type === "story") {
      onSelectStory?.()
    } else if (type === "bookReview") {
      onSelectBookReview?.()
    } else if (type === "letter") {
      onSelectLetter?.()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen px-6 lg:px-12 py-12 lg:py-20" style={{ paddingTop: '128px' }}>
        {/* 返回按钮 */}
        {onBack && (
          <div className="mb-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg font-bold"
            >
              ← Back
            </Button>
          </div>
        )}

        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Choose Your Writing Adventure
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Pick the type of writing that excites you most!
          </p>
        </div>

        {/* 三种写作类型卡片 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {writingTypes.map((type, index) => {
            const isHovered = hoveredCard === type.id
            return (
              <div
                key={type.id}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleSelect(type.id)}
                className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 border-2 border-gray-200 shadow-xl transition-all duration-500 cursor-pointer animate-fade-in"
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  transform: isHovered ? 'scale(1.05) translateY(-0.5rem)' : 'scale(1)',
                }}
              >
                {/* 卡片装饰性边框 */}
                <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${type.gradient} opacity-0 transition-opacity duration-500 ${
                  isHovered ? "opacity-30" : ""
                }`} style={{ padding: '2px', borderRadius: '1.5rem' }}>
                  <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-3xl"></div>
                </div>
                
                <div className="relative z-10 text-center">
                  {/* 图标 */}
                  <div 
                    className={`text-8xl mb-6 transition-all duration-500 ${
                      isHovered
                        ? "scale-125 rotate-6" 
                        : ""
                    }`}
                  >
                    {type.icon}
                  </div>
                  
                  {/* 标题 */}
                  <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent transition-all duration-300 ${
                    isHovered ? "scale-110" : ""
                  }`}>
                    {type.title}
                  </h2>
                  
                  {/* 描述 */}
                  <p className="text-base text-gray-700 leading-relaxed mb-6">
                    {type.description}
                  </p>
                  
                  {/* 特性列表 */}
                  <div className="space-y-2 mb-6">
                    {type.features.map((feature, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-center gap-2 text-sm text-gray-600"
                      >
                        <span className="text-purple-500">✨</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 提示句 */}
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-xl p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 italic">
                      "{type.prompt}"
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部提示 */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            Each writing type helps you practice different skills. Choose the one that sounds most fun to you!
          </p>
        </div>
      </div>
    </div>
  )
}


