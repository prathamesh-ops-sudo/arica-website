import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CyberSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-8 h-8",
    icon: "w-4 h-4",
    text: "text-xs",
  },
  md: {
    container: "w-16 h-16",
    icon: "w-8 h-8",
    text: "text-sm",
  },
  lg: {
    container: "w-24 h-24",
    icon: "w-12 h-12",
    text: "text-base",
  },
};

export function CyberSpinner({ size = "md", text, className }: CyberSpinnerProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} data-testid="cyber-spinner">
      <div className={cn("relative", sizes.container)}>
        <div 
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <div 
          className={cn(
            "relative w-full h-full flex items-center justify-center",
            "animate-[spin_3s_linear_infinite]"
          )}
          style={{
            transformStyle: "preserve-3d",
            animation: "cyber-rotate 2s ease-in-out infinite",
          }}
        >
          <Shield 
            className={cn(
              sizes.icon,
              "text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]"
            )} 
          />
        </div>
        <div 
          className="absolute inset-[-4px] rounded-full border border-primary/50"
          style={{
            animation: "cyber-pulse-ring 1.5s ease-out infinite",
          }}
        />
      </div>
      
      {text && (
        <span className={cn(
          sizes.text,
          "text-primary font-mono tracking-wider animate-pulse"
        )}>
          {text}
        </span>
      )}

      <style>{`
        @keyframes cyber-rotate {
          0% {
            transform: perspective(200px) rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: perspective(200px) rotateY(180deg) rotateX(10deg);
          }
          50% {
            transform: perspective(200px) rotateY(360deg) rotateX(0deg);
          }
          75% {
            transform: perspective(200px) rotateY(540deg) rotateX(-10deg);
          }
          100% {
            transform: perspective(200px) rotateY(720deg) rotateX(0deg);
          }
        }
        
        @keyframes cyber-pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
