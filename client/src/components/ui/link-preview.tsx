import React from "react";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
};

export function LinkPreview({ children, url, className }: LinkPreviewProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-white cursor-pointer underline-offset-4 hover:underline", className)}
    >
      {children}
    </a>
  );
}
