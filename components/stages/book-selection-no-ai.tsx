"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import StageHeader from "@/components/stage-header"
import { toast } from "sonner"

interface BookSelectionNoAiProps {
  reviewType: "recommendation" | "critical" | "literary"
  onBookSelected: (bookTitle: string) => void
  onBack: () => void
}

const reviewTypeNames = {
  recommendation: "Recommendation Review",
  critical: "Critical Review",
  literary: "Literary Review",
}

export default function BookSelectionNoAi({ 
  reviewType, 
  onBookSelected, 
  onBack 
}: BookSelectionNoAiProps) {
  const [bookTitle, setBookTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookTitle.trim()) {
      toast.error("Please enter a book title")
      return
    }

    onBookSelected(bookTitle.trim())
  }

  return (
    <div className="min-h-screen py-6 px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10" style={{ paddingTop: '80px' }}>
        <StageHeader onBack={onBack} />

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Choose Your Book
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            You're writing a <span className="font-bold">{reviewTypeNames[reviewType]}</span>
          </p>
          <p className="text-base text-gray-500">
            Enter the title of the book you'd like to review
          </p>
        </div>


        {/* 输入表单 */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-4 border-purple-300 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="bookTitle" className="block text-xl font-bold mb-4 text-purple-700">
                📚 Book Title
              </label>
              <Input
                id="bookTitle"
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="e.g., Harry Potter and the Sorcerer's Stone"
                className="w-full px-6 py-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:outline-none transition-all"
                style={{ fontFamily: 'var(--font-comic-neue)' }}
                autoFocus
              />
              <p className="mt-3 text-sm text-gray-500 text-center">
                Type the name of the book you want to write about
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="px-8 py-4 text-lg font-bold border-2 border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
              >
                ← Back
              </Button>
              <Button
                type="submit"
                disabled={!bookTitle.trim()}
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-xl rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue ✨
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

