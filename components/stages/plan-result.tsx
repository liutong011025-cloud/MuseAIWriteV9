"use client"

import { Button } from "@/components/ui/button"

interface PlanResultProps {
  recommendation: {
    type: "Story" | "Book Review" | "Letter"
    goal: string
    tips: string[]
    startPrompt: string
    skills?: string[]
    length?: string
    structure?: string[]
  }
  onStart?: () => void
  onBack?: () => void
  onChooseOther?: () => void
}

export default function PlanResult({ recommendation, onStart, onBack, onChooseOther }: PlanResultProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Story":
        return "from-purple-600 via-pink-600 to-orange-600"
      case "Book Review":
        return "from-blue-600 to-cyan-600"
      case "Letter":
        return "from-green-600 to-emerald-600"
      default:
        return "from-purple-600 via-pink-600 to-orange-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Story":
        return "📖"
      case "Book Review":
        return "📝"
      case "Letter":
        return "✉️"
      default:
        return "✨"
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }}></div>
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

        <div className="max-w-4xl mx-auto">
          {/* 推荐标题 */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4 animate-bounce-in">{getTypeIcon(recommendation.type)}</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Recommended: {recommendation.type}
            </h1>
          </div>

          {/* 推荐内容卡片 */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-10 border-2 border-purple-200 shadow-2xl mb-8">
            {/* Goal */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Goal
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed pl-11">
                {recommendation.goal}
              </p>
            </div>

            {/* Tips */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Tips
              </h2>
              <ul className="space-y-3 pl-11">
                {recommendation.tips.map((tip, index) => (
                  <li key={index} className="text-lg md:text-xl text-gray-700 leading-relaxed flex items-start gap-3">
                    <span className="text-purple-600 font-bold mt-1">{index + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            {recommendation.skills && recommendation.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎓</span>
                  Skills You'll Practice
                </h2>
                <ul className="space-y-2 pl-11">
                  {recommendation.skills.map((skill, index) => (
                    <li key={index} className="text-lg md:text-xl text-gray-700 leading-relaxed flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Length */}
            {recommendation.length && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-3xl">📏</span>
                  Suggested Length
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed pl-11">
                  {recommendation.length}
                </p>
              </div>
            )}

            {/* Structure */}
            {recommendation.structure && recommendation.structure.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-3xl">📋</span>
                  Structure Guide
                </h2>
                <ul className="space-y-3 pl-11">
                  {recommendation.structure.map((step, index) => (
                    <li key={index} className="text-lg md:text-xl text-gray-700 leading-relaxed flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Start Prompt */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-purple-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                <span className="text-2xl">✍️</span>
                Start
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed pl-11 italic">
                "{recommendation.startPrompt}"
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {onStart && (
              <Button
                onClick={onStart}
                size="lg"
                className={`bg-gradient-to-r ${getTypeColor(recommendation.type)} hover:opacity-90 text-white border-0 shadow-2xl py-6 px-12 text-xl md:text-2xl font-bold hover:scale-105 transition-all duration-300 rounded-full`}
              >
                Start Writing {recommendation.type}
              </Button>
            )}
            {onChooseOther && (
              <Button
                onClick={onChooseOther}
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-700 shadow-lg font-bold py-6 px-12 text-xl md:text-2xl rounded-full hover:scale-105 transition-all duration-300"
              >
                Or you just want to write...
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

