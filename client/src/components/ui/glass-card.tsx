import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'amber' | 'green' | 'red';
  hover3D?: boolean;
  onClick?: () => void;
  'data-testid'?: string;
}

const glowColors = {
  cyan: 'border-[#00D4FF]/20 hover:border-[#00D4FF]/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]',
  purple: 'border-[#00B4D8]/20 hover:border-[#00B4D8]/40 hover:shadow-[0_0_30px_rgba(0,180,216,0.15)]',
  amber: 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  green: 'border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]',
  red: 'border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]',
};

export function GlassCard({
  children,
  className,
  glowColor = 'cyan',
  hover3D = true,
  onClick,
  'data-testid': testId,
}: GlassCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -8;
    const rotateYValue = (mouseX / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl bg-[rgba(10,10,30,0.7)] backdrop-blur-xl border transition-all duration-300',
        glowColors[glowColor],
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transform: hover3D ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-testid={testId}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
