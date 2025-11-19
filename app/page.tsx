"use client"

import { useState, useEffect } from "react"
import HomePage from "@/components/stages/home-page"
import WelcomePage from "@/components/stages/welcome-page"
import BookReviewWelcome from "@/components/stages/book-review-welcome"
import CharacterCreation from "@/components/stages/character-creation"
import CharacterCreationNoAi from "@/components/stages/character-creation-no-ai"
import PlotBrainstorm from "@/components/stages/plot-brainstorm"
import PlotBrainstormNoAi from "@/components/stages/plot-brainstorm-no-ai"
import StoryStructure from "@/components/stages/story-structure"
import StoryStructureNoAi from "@/components/stages/story-structure-no-ai"
import GuidedWriting from "@/components/stages/guided-writing"
import GuidedWritingNoAi from "@/components/stages/guided-writing-no-ai"
import StoryReview from "@/components/stages/story-review"
import LoginPage from "@/components/auth/login-page"
import Dashboard from "@/components/teacher/dashboard"
import PlanQuiz from "@/components/stages/plan-quiz"
import PlanResult from "@/components/stages/plan-result"
import WriteTypeSelection from "@/components/stages/write-type-selection"
import BookReviewTypeSelection from "@/components/stages/book-review-type-selection"
import BookSelection from "@/components/stages/book-selection"
import BookSelectionNoAi from "@/components/stages/book-selection-no-ai"
import BookReviewLoading from "@/components/stages/book-review-loading"
import BookReviewWriting from "@/components/stages/book-review-writing"
import BookReviewWritingNoAi from "@/components/stages/book-review-writing-no-ai"
import BookReviewComplete from "@/components/stages/book-review-complete"
import AboutPage from "@/components/stages/about-page"
import GalleryPage from "@/components/stages/gallery-page"
import LetterAdventure from "@/components/stages/letter-adventure"
import LetterGame from "@/components/stages/letter-game"
import LetterGameNoAi from "@/components/stages/letter-game-no-ai"
import LetterPuzzle from "@/components/stages/letter-puzzle"
import LetterComplete from "@/components/stages/letter-complete"

export type Language = "en" | "zh"

export interface StoryState {
  character: {
    name: string
    age: number
    traits: string[]
    description: string
    imageUrl?: string
    species?: string
  } | null
  plot: {
    setting: string
    conflict: string
    goal: string
  } | null
  structure: {
    type: "freytag" | "threeAct" | "fichtean"
    outline: string[]
    imageUrl?: string
  } | null
  story: string
}

export default function Home() {
  const [user, setUser] = useState<{ username: string; role: 'teacher' | 'student'; noAi?: boolean } | null>(null)
  const [stage, setStage] = useState<"login" | "home" | "plan" | "planResult" | "writeTypeSelection" | "bookReviewWelcome" | "bookReviewTypeSelection" | "bookSelection" | "bookReviewLoading" | "bookReviewWriting" | "bookReviewComplete" | "bookReviewWritingNoAi" | "bookReviewCompleteNoAi" | "letterAdventure" | "letterGame" | "letterPuzzle" | "letterComplete" | "welcome" | "character" | "plot" | "structure" | "writing" | "review" | "dashboard" | "about" | "gallery">("login")
  const [language, setLanguage] = useState<Language>("en")
  const [planRecommendation, setPlanRecommendation] = useState<{
    type: "Story" | "Book Review" | "Letter"
    goal: string
    tips: string[]
    startPrompt: string
    skills?: string[]
    length?: string
    structure?: string[]
  } | null>(null)
  const [storyState, setStoryState] = useState<StoryState>({
    character: null,
    plot: null,
    structure: null,
    story: "",
  })
  const [bookReviewState, setBookReviewState] = useState<{
    reviewType: "recommendation" | "critical" | "literary" | null
    bookTitle: string | null
    structure: {
      type: "recommendation" | "critical" | "literary"
      outline: string[]
    } | null
    review: string
    bookCoverUrl?: string
    bookSummary?: string
  }>({
    reviewType: null,
    bookTitle: null,
    structure: null,
    review: "",
    bookCoverUrl: undefined,
    bookSummary: undefined,
  })

  const [letterState, setLetterState] = useState<{
    recipient: string | null
    occasion: string | null
    guidance: string | null
    readerImageUrl: string | null
    sections: string[]
    letter: string
  }>({
    recipient: null,
    occasion: null,
    guidance: null,
    readerImageUrl: null,
    sections: [],
    letter: "",
  })

  // Hydration safety
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    setIsReady(true)
    
    // 监听Header的Write!按钮点击事件
    const handleNavigateToWriteTypeSelection = () => {
      if (user) {
        setStage("writeTypeSelection")
      }
    }
    
    const handleNavigateToHome = () => {
      setStage("home")
    }
    
    const handleNavigateToAbout = () => {
      setStage("about")
    }

    const handleNavigateToGallery = () => {
      setStage("gallery")
    }
    
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguage(event.detail)
    }
    
    window.addEventListener('navigateToWriteTypeSelection', handleNavigateToWriteTypeSelection as EventListener)
    window.addEventListener('navigateToHome', handleNavigateToHome as EventListener)
    window.addEventListener('navigateToAbout', handleNavigateToAbout as EventListener)
    window.addEventListener('navigateToGallery', handleNavigateToGallery as EventListener)
    window.addEventListener('headerLanguageChange', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('navigateToWriteTypeSelection', handleNavigateToWriteTypeSelection as EventListener)
      window.removeEventListener('navigateToHome', handleNavigateToHome as EventListener)
      window.removeEventListener('navigateToAbout', handleNavigateToAbout as EventListener)
      window.removeEventListener('navigateToGallery', handleNavigateToGallery as EventListener)
      window.removeEventListener('headerLanguageChange', handleLanguageChange as EventListener)
    }
  }, [user])

  if (!isReady) {
    return null
  }

  return (
    <main className="min-h-screen">
      {stage === "login" && (
        <LoginPage
          onLogin={(userData) => {
            setUser(userData)
            if (userData.role === "teacher") {
              setStage("dashboard")
            } else {
              setStage("home")
            }
          }}
        />
      )}
      {stage === "home" && user && (
        <HomePage
          user={user}
          onStartPlan={() => setStage("plan")}
          onStartWrite={() => setStage("writeTypeSelection")}
          onViewAbout={() => setStage("about")}
        />
      )}
      {stage === "plan" && user && (
        <PlanQuiz
          onComplete={(recommendation) => {
            setPlanRecommendation(recommendation)
            setStage("planResult")
          }}
          onBack={() => setStage("home")}
        />
      )}
      {stage === "planResult" && user && planRecommendation && (
        <PlanResult
          recommendation={planRecommendation}
          onStart={() => {
            if (planRecommendation.type === "Story") {
              setStage("welcome")
            } else if (planRecommendation.type === "Book Review") {
              setStage("bookReviewWelcome")
            } else if (planRecommendation.type === "Letter") {
              setStage("letterAdventure")
            }
          }}
          onBack={() => setStage("plan")}
        />
      )}
      {stage === "writeTypeSelection" && user && (
        <WriteTypeSelection
          onSelectStory={() => setStage("welcome")}
          onSelectBookReview={() => setStage("bookReviewWelcome")}
          onSelectLetter={() => setStage("letterAdventure")}
          onBack={() => setStage("home")}
        />
      )}
      {stage === "bookReviewWelcome" && user && (
        <BookReviewWelcome
          onStartBookReview={() => {
            setBookReviewState({ reviewType: null, bookTitle: null })
            setStage("bookReviewTypeSelection")
          }}
          onBack={() => setStage("home")}
        />
      )}
      {stage === "bookReviewTypeSelection" && user && (
        <BookReviewTypeSelection
          onSelectType={(type) => {
            setBookReviewState(prev => ({ ...prev, reviewType: type }))
            if (user.noAi) {
              setStage("bookSelectionNoAi")
            } else {
              setStage("bookSelection")
            }
          }}
          onBack={() => setStage("bookReviewWelcome")}
        />
      )}
      {stage === "bookSelection" && user && bookReviewState.reviewType && (
        <BookSelection
          reviewType={bookReviewState.reviewType}
          onSelectBook={(title) => {
            setBookReviewState(prev => ({ ...prev, bookTitle: title }))
            setStage("bookReviewLoading")
          }}
          onBack={() => setStage("bookReviewTypeSelection")}
          userId={user.username}
        />
      )}
      {stage === "bookSelectionNoAi" && user && bookReviewState.reviewType && (
        <BookSelectionNoAi
          reviewType={bookReviewState.reviewType}
          onSelectBook={(title) => {
            setBookReviewState(prev => ({ ...prev, bookTitle: title }))
            if (user.noAi) {
              setStage("bookReviewWritingNoAi")
            } else {
              setStage("bookReviewWriting")
            }
          }}
          onBack={() => setStage("bookReviewTypeSelection")}
        />
      )}
      {stage === "bookReviewLoading" && user && bookReviewState.bookTitle && bookReviewState.reviewType && (
        <BookReviewLoading
          reviewType={bookReviewState.reviewType}
          bookTitle={bookReviewState.bookTitle}
          onComplete={(structure, coverUrl, summary) => {
            setBookReviewState(prev => ({
              ...prev,
              structure,
              bookCoverUrl: coverUrl,
              bookSummary: summary,
            }))
            setStage("bookReviewWriting")
          }}
          onBack={() => setStage("bookSelection")}
          userId={user.username}
        />
      )}
      {stage === "bookReviewWriting" && user && bookReviewState.structure && bookReviewState.bookTitle && (
        <BookReviewWriting
          reviewType={bookReviewState.reviewType!}
          bookTitle={bookReviewState.bookTitle}
          structure={bookReviewState.structure}
          bookCoverUrl={bookReviewState.bookCoverUrl}
          bookSummary={bookReviewState.bookSummary}
          onComplete={(review) => {
            setBookReviewState(prev => ({ ...prev, review }))
            setStage("bookReviewComplete")
          }}
          onBack={() => setStage("bookReviewLoading")}
          userId={user.username}
        />
      )}
      {stage === "bookReviewWritingNoAi" && user && bookReviewState.bookTitle && bookReviewState.reviewType && (
        <BookReviewWritingNoAi
          reviewType={bookReviewState.reviewType}
          bookTitle={bookReviewState.bookTitle}
          onComplete={(review) => {
            setBookReviewState(prev => ({ ...prev, review }))
            setStage("bookReviewCompleteNoAi")
          }}
          onBack={() => setStage("bookSelectionNoAi")}
        />
      )}
      {stage === "bookReviewComplete" && user && bookReviewState.review && bookReviewState.bookTitle && (
        <BookReviewComplete
          reviewType={bookReviewState.reviewType!}
          bookTitle={bookReviewState.bookTitle}
          review={bookReviewState.review}
          bookCoverUrl={bookReviewState.bookCoverUrl}
          onReset={() => {
            setBookReviewState({
              reviewType: null,
              bookTitle: null,
              structure: null,
              review: "",
              bookCoverUrl: undefined,
              bookSummary: undefined,
            })
            setStage("home")
          }}
          onBack={() => setStage("bookReviewWriting")}
          userId={user.username}
        />
      )}
      {stage === "bookReviewCompleteNoAi" && user && bookReviewState.review && bookReviewState.bookTitle && (
        <BookReviewComplete
          reviewType={bookReviewState.reviewType!}
          bookTitle={bookReviewState.bookTitle}
          review={bookReviewState.review}
          onReset={() => {
            setBookReviewState({
              reviewType: null,
              bookTitle: null,
              structure: null,
              review: "",
              bookCoverUrl: undefined,
              bookSummary: undefined,
            })
            setStage("home")
          }}
          onBack={() => setStage("bookReviewWritingNoAi")}
          userId={user.username}
        />
      )}
      {stage === "welcome" && user && (
        <WelcomePage
          language={language}
          onLanguageChange={setLanguage}
          onStart={() => {
            setStoryState({ character: null, plot: null, structure: null, story: "" })
            if (user.noAi) {
              setStage("character")
            } else {
              setStage("character")
            }
          }}
          onBack={() => setStage("home")}
          userId={user.username}
        />
      )}
      {stage === "character" && user && (
        user.noAi ? (
          <CharacterCreationNoAi
            onCharacterCreate={(character) => {
              setStoryState(prev => ({ ...prev, character }))
              setStage("plot")
            }}
            onBack={() => setStage("welcome")}
          />
        ) : (
          <CharacterCreation
            onCharacterCreate={(character) => {
              setStoryState(prev => ({ ...prev, character }))
              setStage("plot")
            }}
            onBack={() => setStage("welcome")}
            userId={user.username}
          />
        )
      )}
      {stage === "plot" && user && storyState.character && (
        user.noAi ? (
          <PlotBrainstormNoAi
            character={storyState.character}
            onPlotComplete={(plot) => {
              setStoryState(prev => ({ ...prev, plot }))
              setStage("structure")
            }}
            onBack={() => setStage("character")}
          />
        ) : (
          <PlotBrainstorm
            character={storyState.character}
            onPlotComplete={(plot) => {
              setStoryState(prev => ({ ...prev, plot }))
              setStage("structure")
            }}
            onBack={() => setStage("character")}
            userId={user.username}
          />
        )
      )}
      {stage === "structure" && user && storyState.plot && storyState.character && (
        user.noAi ? (
          <StoryStructureNoAi
            character={storyState.character}
            plot={storyState.plot}
            onStructureSelect={(structure) => {
              setStoryState(prev => ({ ...prev, structure }))
              setStage("writing")
            }}
            onBack={() => setStage("plot")}
          />
        ) : (
          <StoryStructure
            character={storyState.character}
            plot={storyState.plot}
            onStructureSelect={(structure) => {
              setStoryState(prev => ({ ...prev, structure }))
              setStage("writing")
            }}
            onBack={() => setStage("plot")}
            userId={user.username}
          />
        )
      )}
      {stage === "writing" && user && storyState.structure && (
        user.noAi ? (
          <GuidedWritingNoAi
            character={storyState.character!}
            plot={storyState.plot!}
            structure={storyState.structure}
            onStoryComplete={(story) => {
              setStoryState(prev => ({ ...prev, story }))
              setStage("review")
            }}
            onBack={() => setStage("structure")}
          />
        ) : (
          <GuidedWriting
            character={storyState.character!}
            plot={storyState.plot!}
            structure={storyState.structure}
            onStoryComplete={(story) => {
              setStoryState(prev => ({ ...prev, story }))
              setStage("review")
            }}
            onBack={() => setStage("structure")}
            userId={user.username}
          />
        )
      )}
      {stage === "review" && user && storyState.story && (
        <StoryReview
          story={storyState.story}
          character={storyState.character!}
          plot={storyState.plot!}
          structure={storyState.structure!}
          onReset={() => {
            setStoryState({ character: null, plot: null, structure: null, story: "" })
            setStage("home")
          }}
          onBack={() => setStage("writing")}
          userId={user.username}
        />
      )}
      {stage === "dashboard" && user && user.role === "teacher" && (
        <Dashboard user={user} onBack={() => setStage("login")} />
      )}
      {stage === "about" && user && (
        <AboutPage />
      )}

      {stage === "gallery" && (
        <GalleryPage />
      )}

      {/* Letter Writing Adventure - Complete Flow */}
      {stage === "letterAdventure" && user && (
        <LetterAdventure
          onStart={(recipient, occasion, guidance, readerImageUrl) => {
            setLetterState({
              recipient,
              occasion,
              guidance,
              readerImageUrl,
              sections: [],
              letter: "",
            })
            setStage("letterGame")
          }}
          onBack={() => setStage("writeTypeSelection")}
          userId={user.username}
          noAi={user.noAi}
        />
      )}

      {stage === "letterGame" && user && letterState.recipient && letterState.occasion && (
        user.noAi ? (
          <LetterGameNoAi
            recipient={letterState.recipient}
            occasion={letterState.occasion}
            onComplete={(sections) => {
              setLetterState(prev => ({
                ...prev,
                sections,
              }))
              setStage("letterPuzzle")
            }}
            onBack={() => setStage("letterAdventure")}
            userId={user.username}
          />
        ) : letterState.guidance !== null ? (
          <LetterGame
            recipient={letterState.recipient}
            occasion={letterState.occasion}
            guidance={letterState.guidance || ""}
            readerImageUrl={letterState.readerImageUrl}
            onComplete={(sections) => {
              setLetterState(prev => ({
                ...prev,
                sections,
              }))
              setStage("letterPuzzle")
            }}
            onBack={() => setStage("letterAdventure")}
            userId={user.username}
          />
        ) : null
      )}

      {stage === "letterPuzzle" && user && letterState.sections.length > 0 && (
        <LetterPuzzle
          sections={letterState.sections}
          structure={["Greeting", "Opening", "Body", "Closing", "Signature"]}
          onPuzzleComplete={(reorderedSections) => {
            const fullLetter = reorderedSections.join('\n\n')
            setLetterState(prev => ({
              ...prev,
              letter: fullLetter,
            }))
            setStage("letterComplete")
          }}
          onBack={() => setStage("letterGame")}
        />
      )}

      {stage === "letterComplete" && user && letterState.letter && letterState.recipient && letterState.occasion && (
        <LetterComplete
          recipient={letterState.recipient}
          occasion={letterState.occasion}
          letter={letterState.letter}
          onReset={() => {
            setLetterState({
              recipient: null,
              occasion: null,
              guidance: null,
              readerImageUrl: null,
              sections: [],
              letter: "",
            })
            setStage("home")
          }}
          onBack={() => setStage("letterPuzzle")}
          userId={user.username}
        />
      )}
    </main>
  )
}
