import { cn } from "@/lib/utils";

interface ThreeDEffectLoaderProps {
  className?: string;
  text?: string;
}

export function ThreeDEffectLoader({ className, text = "Loading…" }: ThreeDEffectLoaderProps) {
  return (
    <div className={cn("pl", className)}>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__dot"></div>
      <div className="pl__text">{text}</div>
    </div>
  );
}

export default ThreeDEffectLoader;
