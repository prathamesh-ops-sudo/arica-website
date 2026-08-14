'use client'

import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { ThreeDEffectLoader } from '@/components/ui/3d-effect-loader'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

interface SplineErrorBoundaryState {
  hasError: boolean
}

class SplineErrorBoundary extends Component<
  { children: ReactNode },
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <SplineFallback />
    }

    return this.props.children
  }
}

function SplineFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20">
      <p className="text-sm text-white/60">Interactive preview unavailable.</p>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setTimedOut(true), 8000)
    return () => window.clearTimeout(timeout)
  }, [scene])

  if (timedOut) {
    return <SplineFallback />
  }

  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <ThreeDEffectLoader />
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
