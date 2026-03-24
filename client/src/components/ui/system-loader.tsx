"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SystemLoaderProps {
  onComplete?: () => void
  duration?: number
}

const BOOT_MESSAGES = [
  "Initializing security protocols...",
  "Loading threat database...",
  "Establishing secure connection...",
  "Calibrating neural network...",
  "Verifying encryption keys...",
  "System ready."
]

function MatrixRain() {
  const columns = useMemo(() => {
    const cols = []
    const columnCount = Math.floor(typeof window !== 'undefined' ? window.innerWidth / 20 : 50)
    for (let i = 0; i < columnCount; i++) {
      const chars = []
      const charCount = Math.floor(Math.random() * 20) + 10
      for (let j = 0; j < charCount; j++) {
        chars.push(String.fromCharCode(0x30A0 + Math.random() * 96))
      }
      cols.push({
        id: i,
        chars,
        left: `${(i / columnCount) * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.3 + 0.1
      })
    }
    return cols
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute top-0 text-xs"
          style={{
            left: column.left,
            fontFamily: 'monospace',
            color: '#00ff00',
            opacity: column.opacity,
            writingMode: 'vertical-rl',
            textOrientation: 'upright'
          }}
          initial={{ y: '-100%' }}
          animate={{ y: '100vh' }}
          transition={{
            duration: column.duration,
            repeat: Infinity,
            delay: column.delay,
            ease: 'linear'
          }}
        >
          {column.chars.map((char, idx) => (
            <span
              key={idx}
              style={{
                opacity: 1 - (idx / column.chars.length) * 0.7,
                textShadow: idx === 0 ? '0 0 10px #00ff00, 0 0 20px #00ff00' : 'none'
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export function SystemLoader({ onComplete, duration = 4000 }: SystemLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessage, setDisplayedMessage] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const title = "SYSTEM BOOTING..."

  useEffect(() => {
    let charIndex = 0
    const typeTitle = setInterval(() => {
      if (charIndex <= title.length) {
        setDisplayedTitle(title.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeTitle)
      }
    }, 80)

    return () => clearInterval(typeTitle)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 3 + 1
        const newProgress = Math.min(prev + increment, 100)
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setIsComplete(true)
          setTimeout(() => {
            onComplete?.()
          }, 800)
        }
        return newProgress
      })
    }, duration / 40)

    return () => clearInterval(progressInterval)
  }, [duration, onComplete])

  useEffect(() => {
    const messageThresholds = [0, 20, 40, 60, 80, 95]
    const newIndex = messageThresholds.findIndex((threshold, idx) => {
      const nextThreshold = messageThresholds[idx + 1] ?? 100
      return progress >= threshold && progress < nextThreshold
    })
    if (newIndex !== -1 && newIndex !== currentMessageIndex) {
      setCurrentMessageIndex(newIndex)
      setDisplayedMessage("")
    }
  }, [progress, currentMessageIndex])

  useEffect(() => {
    const currentMessage = BOOT_MESSAGES[currentMessageIndex]
    let charIndex = 0
    const typeMessage = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayedMessage(currentMessage.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeMessage)
      }
    }, 30)

    return () => clearInterval(typeMessage)
  }, [currentMessageIndex])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#0a0a1e' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          data-testid="system-loader-overlay"
        >
          <MatrixRain />

          <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-2xl w-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="text-4xl md:text-6xl font-bold tracking-wider"
                style={{
                  fontFamily: 'monospace',
                  color: '#3D70B7',
                  textShadow: '0 0 10px #3D70B7, 0 0 20px #3D70B7, 0 0 40px #3D70B7'
                }}
                data-testid="loader-title"
              >
                {displayedTitle}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: '#3D70B7' }}
                >
                  _
                </motion.span>
              </h1>
            </motion.div>

            <div className="w-full max-w-md">
              <div
                className="relative h-3 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'rgba(61, 112, 183, 0.1)',
                  border: '1px solid rgba(61, 112, 183, 0.3)'
                }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #3D70B7, #3D70B7)',
                    boxShadow: '0 0 10px #3D70B7, 0 0 20px #3D70B7, 0 0 30px #3D70B7'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                  data-testid="loader-progress-bar"
                />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                  }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <span
                  className="text-sm"
                  style={{ fontFamily: 'monospace', color: '#3D70B7' }}
                >
                  LOADING
                </span>
                <motion.span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: 'monospace',
                    color: '#3D70B7',
                    textShadow: '0 0 5px #3D70B7'
                  }}
                  data-testid="loader-percentage"
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>
            </div>

            <motion.div
              className="h-8 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className="text-center"
                style={{ fontFamily: 'monospace' }}
              >
                <span style={{ color: '#3D70B7', marginRight: '8px' }}>&gt;</span>
                <span
                  style={{
                    color: '#00ff00',
                    textShadow: '0 0 5px #00ff00'
                  }}
                  data-testid="loader-boot-message"
                >
                  {displayedMessage}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ color: '#00ff00' }}
                >
                  █
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: progress > (i + 1) * 30 ? '#3D70B7' : 'rgba(61, 112, 183, 0.2)',
                    boxShadow: progress > (i + 1) * 30 ? '0 0 10px #3D70B7' : 'none'
                  }}
                  animate={progress > (i + 1) * 30 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-xs"
              style={{ fontFamily: 'monospace', color: 'rgba(61, 112, 183, 0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span>CYBER GUARDIAN v2.0</span>
              <span>|</span>
              <span>SECURE BOOT ENABLED</span>
              <span>|</span>
              <span>AES-256 ENCRYPTION</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SystemLoader
