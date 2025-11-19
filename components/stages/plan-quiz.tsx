"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PlanQuizProps {
  onComplete?: (recommendation: {
    type: "Story" | "Book Review" | "Letter"
    goal: string
    tips: string[]
    startPrompt: string
    skills?: string[]
    length?: string
    structure?: string[]
  }) => void
  onBack?: () => void
  onSkipToSelection?: () => void
}

interface Question {
  id: number
  question: string
  options: {
    label: string
    text: string
    hint: "Letter" | "Book Review" | "Story"
    goal?: string
    skill?: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which thing sounds most fun to write about?",
    options: [
      {
        label: "A",
        text: "Telling a friend what happened today (I like sharing real things).",
        hint: "Letter",
        goal: "practice clear expression and friendly tone"
      },
      {
        label: "B",
        text: "Saying if a book was awesome or boring and why (I like giving opinions).",
        hint: "Book Review",
        goal: "practice opinion and reasons"
      },
      {
        label: "C",
        text: "Making up a magical adventure with cool characters (I love imagining).",
        hint: "Story",
        goal: "practice imagination and plotting"
      }
    ]
  },
  {
    id: 2,
    question: "Who would you rather write for?",
    options: [
      {
        label: "A",
        text: "A friend, parent, or teacher (someone I know).",
        hint: "Letter"
      },
      {
        label: "B",
        text: "Kids who might read a book I liked (people who want advice).",
        hint: "Book Review"
      },
      {
        label: "C",
        text: "Anyone who loves adventures or surprises (an audience for my tale).",
        hint: "Story"
      }
    ]
  },
  {
    id: 3,
    question: "What do you want to get better at when writing?",
    options: [
      {
        label: "A",
        text: "Saying how I feel and being friendly (write like a buddy).",
        hint: "Letter",
        skill: "tone and emotions"
      },
      {
        label: "B",
        text: "Explaining why something is good or not with examples (give reasons).",
        hint: "Book Review",
        skill: "opinion + evidence"
      },
      {
        label: "C",
        text: "Making plots, characters and surprises (build a whole world).",
        hint: "Story",
        skill: "creativity and structure"
      }
    ]
  },
  {
    id: 4,
    question: "How long would you like your piece to be?",
    options: [
      {
        label: "A",
        text: "Short and sweet — just a few paragraphs (fast to finish).",
        hint: "Letter"
      },
      {
        label: "B",
        text: "A bit longer but focused — telling why I liked a book (clear parts).",
        hint: "Book Review"
      },
      {
        label: "C",
        text: "Longer with scenes and maybe chapter ideas (big imagination).",
        hint: "Story"
      }
    ]
  },
  {
    id: 5,
    question: "What do you enjoy doing when you read or listen?",
    options: [
      {
        label: "A",
        text: "Talking about how it made me feel or what happened to the people.",
        hint: "Letter"
      },
      {
        label: "B",
        text: "Thinking about whether I liked it and what the best parts were.",
        hint: "Book Review"
      },
      {
        label: "C",
        text: "Remembering characters and wishes for what happens next.",
        hint: "Story"
      }
    ]
  },
  {
    id: 6,
    question: "Pick a prompt that sounds best:",
    options: [
      {
        label: "A",
        text: "\"Hi! Guess what I did today?\"",
        hint: "Letter"
      },
      {
        label: "B",
        text: "\"This book is great because…\"",
        hint: "Book Review"
      },
      {
        label: "C",
        text: "\"Once upon a time, a dragon lost its color…\"",
        hint: "Story"
      }
    ]
  },
  {
    id: 7,
    question: "If you had a superpower for writing, which would you choose?",
    options: [
      {
        label: "A",
        text: "Make someone smile with one sentence (friendly voice).",
        hint: "Letter"
      },
      {
        label: "B",
        text: "Convince a classmate to read your favorite book (persuasive reasons).",
        hint: "Book Review"
      },
      {
        label: "C",
        text: "Build worlds that feel real (inventing details and scenes).",
        hint: "Story"
      }
    ]
  }
]

const recommendations = {
  "Story": {
    goal: "Practice imagination, character building and plot.",
    tips: [
      "Start with a strong opening line (e.g., \"The day the rain talked, everything changed…\").",
      "Make a main character and one problem they must solve.",
      "Write 3 short scenes: beginning, middle, end."
    ],
    startPrompt: "Once upon a time, a small cat found a glowing map…"
  },
  "Book Review": {
    goal: "Practice giving opinions with reasons and examples.",
    tips: [
      "Start by saying if you liked the book and why.",
      "Give 2-3 examples from the book to support your opinion.",
      "End with who you think would enjoy this book."
    ],
    startPrompt: "This book is great because…"
  },
  "Letter": {
    goal: "Practice clear feelings and friendly tone.",
    tips: [
      "Start with a friendly greeting.",
      "Share what happened and how you felt about it.",
      "End with a question or wish for the person."
    ],
    startPrompt: "Hi! Guess what I did today?"
  }
}

export default function PlanQuiz({ onComplete, onBack, onSkipToSelection }: PlanQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})

  const handleAnswer = (hint: "Letter" | "Book Review" | "Story") => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: hint }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 计算推荐
      const scores = { Letter: 0, "Book Review": 0, Story: 0 }
      
      Object.values(newAnswers).forEach((answer) => {
        if (answer === "Letter") scores.Letter++
        else if (answer === "Book Review") scores["Book Review"]++
        else if (answer === "Story") scores.Story++
      })

      // 找到最高分
      const maxScore = Math.max(scores.Letter, scores["Book Review"], scores.Story)
      let recommendedType: "Story" | "Book Review" | "Letter" = "Story"
      
      if (scores.Story === maxScore) {
        recommendedType = "Story"
      } else if (scores["Book Review"] === maxScore) {
        recommendedType = "Book Review"
      } else if (scores.Letter === maxScore) {
        recommendedType = "Letter"
      }

      // 获取目标（从第3题）
      const question3Answer = newAnswers[3]
      let goal = recommendations[recommendedType].goal
      let skills: string[] = []
      if (question3Answer) {
        const q3Option = questions[2].options.find(opt => opt.hint === question3Answer)
        if (q3Option?.goal) {
          goal = `Practice ${q3Option.goal}.`
        } else if (q3Option?.skill) {
          goal = `Practice ${q3Option.skill}.`
          skills = [q3Option.skill]
        }
      }

      // 获取长度建议（从第4题）
      const question4Answer = newAnswers[4]
      let length = ""
      if (question4Answer) {
        const q4Option = questions[3].options.find(opt => opt.hint === question4Answer)
        if (q4Option?.text.includes("Short")) {
          length = "Short and sweet — just a few paragraphs"
        } else if (q4Option?.text.includes("bit longer")) {
          length = "A bit longer but focused — clear parts"
        } else if (q4Option?.text.includes("Longer")) {
          length = "Longer with scenes and maybe chapter ideas"
        }
      }

      // 根据类型生成结构建议
      let structure: string[] = []
      if (recommendedType === "Story") {
        structure = ["Beginning: Introduce your character and setting", "Middle: Show the problem or adventure", "End: Solve the problem or complete the adventure"]
      } else if (recommendedType === "Book Review") {
        structure = ["Introduction: What book and your overall opinion", "Body: Reasons and examples from the book", "Conclusion: Who would enjoy this book"]
      } else if (recommendedType === "Letter") {
        structure = ["Greeting: Say hello to your reader", "Body: Share what happened and how you felt", "Closing: Ask a question or send wishes"]
      }

      onComplete?.({
        type: recommendedType,
        goal,
        tips: recommendations[recommendedType].tips,
        startPrompt: recommendations[recommendedType].startPrompt,
        skills: skills.length > 0 ? skills : undefined,
        length: length || undefined,
        structure
      })
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

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

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Start with a Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Let's find the perfect writing type for you!
          </p>
        </div>

        {/* 进度条 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* 问题卡片 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-10 border-2 border-purple-200 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.hint)}
                  className="w-full text-left bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 hover:from-purple-100 hover:via-pink-100 hover:to-orange-100 border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                      {option.label}
                    </div>
                    <p className="flex-1 text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
                      {option.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 或者你想写？按钮 */}
          {onSkipToSelection && (
            <div className="max-w-3xl mx-auto mt-8 text-center">
              <Button
                onClick={onSkipToSelection}
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-lg border-2 border-purple-300 hover:bg-purple-50 text-purple-700 shadow-lg font-bold py-4 px-8 text-lg md:text-xl rounded-full hover:scale-105 transition-all duration-300"
              >
                Or you just want to write...
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

