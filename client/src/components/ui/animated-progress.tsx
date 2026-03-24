import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'red' | 'green' | 'amber' | 'gradient';
  showLabel?: boolean;
  labelPosition?: 'top' | 'right' | 'inside';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

const colorStyles = {
  cyan: {
    bar: 'bg-[#3D70B7]',
    glow: 'shadow-[0_0_20px_rgba(61,112,183,0.6)]',
    text: 'text-[#3D70B7]',
  },
  purple: {
    bar: 'bg-[#3D70B7]',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]',
    text: 'text-[#3D70B7]',
  },
  red: {
    bar: 'bg-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]',
    text: 'text-red-400',
  },
  green: {
    bar: 'bg-green-500',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.6)]',
    text: 'text-green-400',
  },
  amber: {
    bar: 'bg-amber-500',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    text: 'text-amber-400',
  },
  gradient: {
    bar: 'bg-gradient-to-r from-[#3D70B7] to-[#3D70B7]',
    glow: 'shadow-[0_0_20px_rgba(61,112,183,0.4)]',
    text: 'text-[#3D70B7]',
  },
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function AnimatedProgress({
  value,
  max = 100,
  color = 'gradient',
  showLabel = true,
  labelPosition = 'right',
  size = 'md',
  className,
  'data-testid': testId,
}: AnimatedProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  
  const percentage = Math.min((value / max) * 100, 100);
  const styles = colorStyles[color];
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(percentage);
    }
  }, [isInView, percentage, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const animatedWidth = useTransform(springValue, (val) => `${val}%`);

  return (
    <div
      ref={ref}
      className={cn('w-full', className)}
      data-testid={testId}
    >
      <div className={cn(
        'flex items-center gap-3',
        labelPosition === 'top' && 'flex-col items-end'
      )}>
        <div className={cn(
          'flex-1 w-full bg-white/10 rounded-full overflow-hidden relative',
          sizeStyles[size]
        )}>
          <motion.div
            className={cn(
              'h-full rounded-full',
              styles.bar,
              styles.glow
            )}
            style={{ width: animatedWidth }}
          />
          {labelPosition === 'inside' && size === 'lg' && showLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {displayValue}%
              </span>
            </div>
          )}
        </div>
        {showLabel && labelPosition !== 'inside' && (
          <motion.span
            className={cn(
              'font-bold tabular-nums min-w-[3ch]',
              styles.text,
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base'
            )}
          >
            {displayValue}%
          </motion.span>
        )}
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'red' | 'green' | 'amber' | 'gradient';
  showLabel?: boolean;
  label?: string;
  className?: string;
  'data-testid'?: string;
}

const gradientIds = {
  cyan: 'cyan-gradient',
  purple: 'purple-gradient',
  red: 'red-gradient',
  green: 'green-gradient',
  amber: 'amber-gradient',
  gradient: 'main-gradient',
};

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'gradient',
  showLabel = true,
  label,
  className,
  'data-testid': testId,
}: CircularProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const styles = colorStyles[color];

  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 15,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(percentage);
    }
  }, [isInView, percentage, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const strokeDashoffset = useTransform(
    springValue,
    (val) => circumference - (val / 100) * circumference
  );

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      data-testid={testId}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id={gradientIds[color]} x1="0%" y1="0%" x2="100%" y2="0%">
            {color === 'gradient' ? (
              <>
                <stop offset="0%" stopColor="#3D70B7" />
                <stop offset="100%" stopColor="#3D70B7" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={color === 'cyan' ? '#3D70B7' : color === 'purple' ? '#42BA90' : color === 'red' ? '#ef4444' : color === 'green' ? '#22c55e' : '#f59e0b'} />
                <stop offset="100%" stopColor={color === 'cyan' ? '#42BA90' : color === 'purple' ? '#3D70B7' : color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#d97706'} />
              </>
            )}
          </linearGradient>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientIds[color]})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={`url(#glow-${color})`}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', styles.text)}>
            {displayValue}%
          </span>
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
