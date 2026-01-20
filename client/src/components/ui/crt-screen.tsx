import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CRTScreenProps {
  children: ReactNode;
  className?: string;
  greenTint?: boolean;
  scanlineIntensity?: 'subtle' | 'medium' | 'strong';
  flickerEnabled?: boolean;
  curveEnabled?: boolean;
}

export function CRTScreen({
  children,
  className,
  greenTint = false,
  scanlineIntensity = 'subtle',
  flickerEnabled = true,
  curveEnabled = true,
}: CRTScreenProps) {
  const scanlineClass = {
    subtle: 'crt-scanlines-subtle',
    medium: 'crt-scanlines-medium',
    strong: 'crt-scanlines-strong',
  }[scanlineIntensity];

  return (
    <div
      className={cn(
        'crt-screen relative',
        scanlineClass,
        flickerEnabled && 'crt-flicker',
        curveEnabled && 'crt-curve',
        greenTint && 'crt-green-tint',
        className
      )}
    >
      <div className="crt-overlay" />
      <div className="crt-noise" />
      <div className="crt-glow" />
      {children}
    </div>
  );
}

export function TerminalText({
  children,
  className,
  color = 'cyan',
}: {
  children: ReactNode;
  className?: string;
  color?: 'cyan' | 'green' | 'amber';
}) {
  const colorClass = {
    cyan: 'text-terminal-cyan',
    green: 'text-terminal-green',
    amber: 'text-terminal-amber',
  }[color];

  return (
    <span className={cn('font-mono', colorClass, className)}>
      {children}
    </span>
  );
}

export function BlinkingCursor({ color = 'cyan' }: { color?: 'cyan' | 'green' | 'amber' }) {
  const colorClass = {
    cyan: 'bg-terminal-cyan',
    green: 'bg-terminal-green',
    amber: 'bg-terminal-amber',
  }[color];

  return <span className={cn('crt-cursor', colorClass)} />;
}

export function TerminalPrompt({
  children,
  prompt = '>',
  className,
}: {
  children: ReactNode;
  prompt?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 font-mono', className)}>
      <span className="text-terminal-green">{prompt}</span>
      <span className="text-terminal-cyan">{children}</span>
      <BlinkingCursor />
    </div>
  );
}
