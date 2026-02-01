import { ReactNode, useEffect, useState } from 'react';
import { isWebGLAvailable } from '@/lib/webgl-utils';

interface WebGLFallbackProps {
  children: ReactNode;
  fallback?: ReactNode;
  showMessage?: boolean;
}

function CSSParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20 animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function DefaultFallback({ showMessage }: { showMessage: boolean }) {
  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      data-testid="webgl-fallback-container"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a1e] via-[#1a0a2e] to-[#0a1a2e] animate-gradient-shift"
        style={{
          backgroundSize: '400% 400%',
        }}
      />
      
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(139, 34, 82, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(107, 28, 50, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(192, 128, 129, 0.1) 0%, transparent 60%)
            `,
          }}
        />
      </div>
      
      <CSSParticles />
      
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 34, 82, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 34, 82, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8B2252] to-[#6B1C32] flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Enhanced Graphics Unavailable
            </h3>
            <p className="text-white/60 text-sm max-w-xs">
              Your browser doesn't support WebGL. The experience is optimized with a beautiful fallback.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function WebGLFallback({ 
  children, 
  fallback, 
  showMessage = false 
}: WebGLFallbackProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  if (webglSupported === null) {
    return <DefaultFallback showMessage={false} />;
  }

  if (!webglSupported) {
    return fallback ? <>{fallback}</> : <DefaultFallback showMessage={showMessage} />;
  }

  return <>{children}</>;
}

export default WebGLFallback;
