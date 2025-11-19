"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HomePageProps {
  onStartStory?: () => void
  onStartBookReview?: () => void
  onStartLetter?: () => void
  onStartPlan?: () => void
}

export default function HomePage({ 
  onStartStory, 
  onStartBookReview, 
  onStartLetter,
  onStartPlan
}: HomePageProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [expandProgress, setExpandProgress] = useState(0) // 0 = 完全重叠, 1 = 完全展开
  const featuresRef = useRef<HTMLDivElement>(null)

  const cards = [
    {
      id: 1,
      title: "Story Writing",
      description: "Create magical stories with help from your AI mentor",
      icon: "📖",
      gradient: "from-purple-600 via-pink-600 to-orange-600",
      hoverGradient: "from-purple-700 via-pink-700 to-orange-700",
      onClick: onStartStory,
    },
    {
      id: 2,
      title: "Book Review",
      description: "Write thoughtful book reviews with AI assistance",
      icon: "📝",
      gradient: "from-blue-600 to-cyan-600",
      hoverGradient: "from-blue-700 to-cyan-700",
      onClick: onStartBookReview,
    },
    {
      id: 3,
      title: "Letter Writing",
      description: "Compose letters with creative writing support",
      icon: "✉️",
      gradient: "from-green-600 to-emerald-600",
      hoverGradient: "from-green-700 to-emerald-700",
      onClick: onStartLetter,
    },
  ]

  const features = [
    {
      id: 1,
      icon: "🤖",
      title: "AI Partner",
      items: [
        "Inspiring questions & prompts",
        "Targeted revision suggestions",
        "Keeps your personal voice"
      ],
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      gradient: "from-purple-600/20"
    },
    {
      id: 2,
      icon: "📚",
      title: "Self-Learning",
      items: [
        "Plan, monitor, evaluate",
        "Develop independent skills",
        "Build reflective thinking"
      ],
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      gradient: "from-blue-600/20"
    },
    {
      id: 3,
      icon: "🌟",
      title: "Collaboration",
      items: [
        "Share in galaxy library",
        "Peer-review & feedback",
        "Continuous improvement"
      ],
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
      gradient: "from-pink-600/20"
    },
  ]

  // 根据滚动位置计算展开进度（0-1之间的连续值）
  useEffect(() => {
    if (!featuresRef.current) return

    const handleScroll = () => {
      if (!featuresRef.current) return
      
      const rect = featuresRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportCenter = viewportHeight / 2
      
      // 计算元素中心点相对于视口的位置
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - viewportCenter
      
      // 重新设计展开逻辑：展开时间维持的短一些
      // 当元素在视口中心时，progress = 1
      // 当元素距离视口中心越远，progress 越小
      const maxDistance = 800 // 最大展开距离（像素）
      const centerZone = 20 // 中心区域，在此区域内 progress = 1（进一步减小中心区域，让展开时间更短）
      const absDistance = Math.abs(distanceFromCenter)
      
      let progress = 0
      
      // 计算基础进度（0-1），使用反向线性插值
      // 当 distanceFromCenter = 0 时，progress = 1
      // 当 absDistance = maxDistance 时，progress = 0
      if (absDistance <= centerZone) {
        // 在中心区域内，直接设置为1，但中心区域很小，所以展开时间短
        progress = 1
      } else if (absDistance < maxDistance) {
        // 使用线性插值，从 centerZone 到 maxDistance 平滑过渡
        const transitionRange = maxDistance - centerZone
        const distanceFromCenterZone = absDistance - centerZone
        progress = 1 - (distanceFromCenterZone / transitionRange)
        
        // 确保 progress 不会小于 0
        progress = Math.max(0, progress)
      } else {
        // 元素在展开区域外，完全重叠
        progress = 0
      }
      
      // 确保 progress 在 0-1 之间
      progress = Math.max(0, Math.min(1, progress))
      
      setExpandProgress(progress)
    }

    // 初始检查
    handleScroll()

    // 使用 requestAnimationFrame 优化滚动性能，确保每帧都更新
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll()
          rafId = null
        })
      }
    }

    // 监听滚动事件 - 使用节流优化性能
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* 主要内容容器 - 从 header 下方开始，添加顶部 padding 避免被 header 遮挡 */}
      <div className="relative z-10 min-h-screen px-6 lg:px-12 pb-12 lg:pb-20" style={{ paddingTop: '128px' }}>
        {/* 顶部标题区域 - 大号艺术字体 */}
        <div className="text-center mb-12 lg:mb-16 mt-16 lg:mt-24 animate-fade-in-up" style={{ animationDelay: '0s' }}>
          <h1 
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
            style={{
              letterSpacing: '-0.03em',
              lineHeight: '0.9',
              fontFamily: 'serif',
            }}
          >
            Welcome to
          </h1>
          <h1 
            className="text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent italic"
            style={{
              letterSpacing: '-0.02em',
              lineHeight: '0.9',
              fontFamily: 'serif',
            }}
          >
            Muse AI Write
          </h1>
          <div className="w-40 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 副标题 - 不同字体大小 */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            The Future of Creative Writing
          </p>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            in the AI Era
          </p>
        </div>

        {/* 核心标语 - 大号 */}
        <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Unleash Creativity,
            </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {' '}Empower Expression
            </span>
          </p>
        </div>

        {/* 网格布局 - 分散内容 */}
        <div className="max-w-7xl mx-auto">
          {/* 第一行：平台介绍 */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }} data-about-section>
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-purple-200 shadow-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">About MuseAIWrite</h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
                An AI-powered platform for senior primary school students. 
                <br /><br />
                Combines <strong>artificial intelligence</strong> with <strong>self-regulated learning</strong> principles.
                <br /><br />
                Creates a <strong>personalized, interactive</strong> writing experience.
              </p>
            </div>
          </div>

          {/* 第二行：三个功能卡片 - 滚动展开/收缩效果 */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              How We Enhance Creative Writing
            </h2>
            
            {/* 功能卡片容器 - 使用 ref 进行滚动检测 */}
            <div 
              ref={featuresRef}
              className="relative h-[500px] md:h-[450px] flex items-center justify-center mb-4"
            >
              {/* 重叠状态 - 显示 logo.png */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: 1 - expandProgress,
                  transform: `scale(${1 - expandProgress * 0.1}) translateY(${-expandProgress * 20}px)`,
                  transition: 'none', // 移除transition，使用直接样式更新
                }}
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/90 backdrop-blur-lg rounded-3xl p-4 md:p-6 border-4 border-purple-300 shadow-2xl flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="MuseAIWrite Logo"
                    width={240}
                    height={240}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>

              {/* 展开状态 - 三个分离的卡片 */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: expandProgress,
                }}
              >
                {/* 使用绝对定位，让卡片从中心点展开 */}
                <div className="relative w-full max-w-7xl mx-auto h-full flex items-center justify-center px-4">
                  {features.map((feature, index) => {
                    const isHovered = hoveredCard === feature.id
                    // 重新计算卡片展开逻辑
                    // 当 progress = 0 时，所有卡片重叠在中心（offset = 0）
                    // 当 progress = 1 时，卡片完全展开
                    // 使用更大的间距，确保三个卡片完全展开
                    // 计算合适的卡片宽度和间距，确保三个卡片能在容器内完全展开
                    const cardWidth = 380 // 卡片宽度（像素）
                    const cardGap = 80 // 卡片之间的间隙（像素）- 增大间隙，确保完全分离
                    const totalCardSpacing = cardWidth + cardGap // 每个卡片占用的总空间 = 460px
                    
                    // 计算每个卡片从中心点展开的偏移量
                    // 左边卡片：-460px，中间：0，右边：+460px
                    // 直接使用 expandProgress，不使用任何变换函数
                    // 确保当 expandProgress = 1 时，卡片完全展开
                    const centerOffsetX = (index - 1) * totalCardSpacing * expandProgress
                    
                    // 计算每个卡片的垂直偏移量（错位效果）
                    const baseOffsetY = index === 1 ? -28 : index === 2 ? 28 : 0
                    const cardOffsetY = baseOffsetY * expandProgress
                    
                    // 计算缩放（从 0.4 到 1.0）- 从更小的尺寸开始，变化范围更大
                    const minScale = 0.4
                    const maxScale = 1.0
                    const cardScale = minScale + expandProgress * (maxScale - minScale)
                    
                    // 计算z-index，确保展开时卡片有正确的层级
                    // 当展开时，中间的卡片在最上层
                    const cardZIndex = expandProgress > 0.3 
                      ? (index === 1 ? 12 : index === 0 ? 11 : 10) // 中间卡片最高
                      : index
                    
                    return (
                      <div
                        key={feature.id}
                        className="absolute perspective-1000"
                        onMouseEnter={() => expandProgress > 0.2 && setHoveredCard(feature.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          left: `50%`,
                          top: `50%`,
                          transform: `translate(-50%, -50%) translateX(${centerOffsetX}px) translateY(${cardOffsetY}px) scale(${cardScale})`,
                          pointerEvents: expandProgress > 0.2 ? 'auto' : 'none',
                          width: `${cardWidth}px`,
                          zIndex: cardZIndex,
                        }}
                      >
                        <div 
                          className={`relative bg-white/95 backdrop-blur-md rounded-2xl p-8 border-2 ${feature.borderColor} shadow-2xl cursor-pointer ${
                            isHovered ? 'shadow-3xl' : ''
                          }`}
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: isHovered 
                              ? `perspective(1000px) rotateY(${index === 1 ? '12deg' : '-12deg'}) scale(1.05)` 
                              : 'perspective(1000px) rotateY(0deg) scale(1)',
                            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                          }}
                        >
                          {/* 翻页阴影效果 */}
                          <div 
                            className={`absolute inset-0 bg-gradient-to-l ${feature.gradient} to-transparent rounded-2xl`}
                            style={{
                              opacity: isHovered ? 0.3 : 0,
                              transition: 'opacity 0.3s ease-out',
                            }}
                          ></div>
                          
                          <div className="relative z-10">
                            <div 
                              className="text-6xl mb-5 text-center" 
                              style={{
                                transform: isHovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                                transition: 'transform 0.3s ease-out',
                              }}
                            >
                              {feature.icon}
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${feature.textColor} text-center`}>
                              {feature.title}
                            </h3>
                            <div className="space-y-2 text-center">
                              {feature.items.map((item, i) => (
                                <p key={i} className="text-sm text-gray-700 font-medium">
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 问题框 - 横贯页面，带背景图片 */}
          <div className="mb-12 -mx-6 lg:-mx-12 mt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              {/* 背景图片 */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url(/Background.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* 渐变遮罩让文字清晰 */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-800/60 to-indigo-900/70"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-transparent to-transparent"></div>
              
              {/* 问题文字 - 居中 */}
              <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
                <div className="text-center max-w-4xl">
                  <div className="text-6xl mb-6 animate-bounce-in" style={{ animationDelay: '0.1s' }}>💭</div>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed drop-shadow-lg">
                    How can AI make creative writing more engaging for ESL learners while maintaining originality?
                  </p>
                </div>
              </div>

              {/* 图片信息 - 右下角 */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-xl max-w-xs">
                <p className="text-white text-sm leading-relaxed">
                  <span className="font-bold">The Parnassus</span> by <span className="font-bold">Raphael</span> (1509–1511). 
                  <br />
                  <span className="text-xs opacity-90">Muse, the goddess of inspiration, guides creativity.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 第三行：愿景 - 一段话 */}
          <div className="mb-12 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-4xl md:text-5xl font-black text-center mb-8 text-black">
              Our Vision
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-black leading-relaxed text-center">
                Reshape creative writing education for the digital age. Become a global innovator in creative writing education. Cultivate the next generation of creative leaders.
              </p>
            </div>
          </div>

          {/* Start with a Plan 按钮 */}
          <div className="text-center mb-12 mt-20 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="mb-8">
              <span className="text-8xl md:text-9xl lg:text-[10rem] animate-wiggle" style={{ display: 'inline-block' }}>
                ✍️
              </span>
            </div>
            <Button
              onClick={() => {
                // 跳转到制定学习计划界面
                onStartPlan?.()
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-2xl py-8 px-16 text-2xl md:text-3xl lg:text-4xl font-bold hover:scale-105 transition-all duration-300 rounded-full relative overflow-hidden group animate-gentle-bounce"
            >
              <span className="relative z-10">Start with a Plan</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

