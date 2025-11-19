"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BookReviewWelcomeProps {
  onStartBookReview?: () => void
  onBack?: () => void
}

export default function BookReviewWelcome({ 
  onStartBookReview, 
  onBack 
}: BookReviewWelcomeProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* 主要内容容器 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航栏 */}
        {onBack && (
          <div className="relative z-10 p-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg font-bold"
            >
              ← Back to Home
            </Button>
          </div>
        )}
        
        {/* 标题区域 */}
        <div className="relative w-full py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-7xl mb-6 animate-bounce-in" style={{ animationDelay: '0.1s' }}>📚</div>
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up"
              style={{
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                animationDelay: '0s',
              }}
            >
              Book Review Writing
            </h1>
            <p 
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up" 
              style={{ animationDelay: '0.2s' }}
            >
              Share your thoughts and insights about books
            </p>
            <div 
              className="w-32 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mx-auto mt-8 rounded-full animate-scale-in" 
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
          {/* 介绍段落 */}
          <div className="prose prose-lg max-w-none mb-16 space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              Learn to write thoughtful and engaging book reviews with AI assistance. Our platform helps you analyze books, express your opinions, and develop critical thinking skills.
            </p>
          </div>

          {/* 功能特点 */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              What You&apos;ll Learn
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Analyze Books */}
              <div 
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-5xl mb-4 text-center animate-bounce-in" style={{ animationDelay: '0.1s' }}>🔍</div>
                <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">Analyze Books</h3>
                <p className="text-gray-700 leading-relaxed">
                  Learn to identify key themes, characters, and plot elements in the books you read. Develop your analytical thinking skills.
                </p>
              </div>

              {/* Express Opinions */}
              <div 
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-cyan-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-5xl mb-4 text-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>💭</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-700 text-center">Express Opinions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Practice sharing your thoughts and feelings about books in a clear and engaging way. Build confidence in expressing your ideas.
                </p>
              </div>

              {/* Critical Thinking */}
              <div 
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-teal-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-5xl mb-4 text-center animate-bounce-in" style={{ animationDelay: '0.3s' }}>🧠</div>
                <h3 className="text-2xl font-bold mb-4 text-teal-700 text-center">Critical Thinking</h3>
                <p className="text-gray-700 leading-relaxed">
                  Develop your ability to evaluate books, compare different works, and form well-reasoned judgments about what you read.
                </p>
              </div>
            </div>
          </div>

          {/* 行动按钮区域 */}
          <div className="text-center mt-16 mb-12 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="flex flex-wrap justify-center gap-6">
              {onStartBookReview && (
                <Button
                  onClick={onStartBookReview}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-2xl py-6 px-12 text-xl font-bold hover:scale-105 transition-transform duration-300 animate-bounce-in"
                  style={{ animationDelay: '1.1s' }}
                >
                  📝 Start Writing Book Review
                </Button>
              )}
              {onBack && (
                <Button
                  onClick={onBack}
                  size="lg"
                  variant="outline"
                  className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-xl py-6 px-12 text-xl font-bold hover:scale-105 transition-transform duration-300 animate-bounce-in"
                  style={{ animationDelay: '1.2s' }}
                >
                  ← Back to Home
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
