import type React from "react"
import { cn } from "@/lib/utils"

export function GlowingText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn("glow-text", className)}>{children}</span>
}

export function CyberButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "cyber-border relative px-6 py-3 bg-muted hover:bg-muted/80 transition-all duration-300 text-foreground font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function GradientHeading({
  children,
  className,
  as = "h2",
}: {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}) {
  const Component = as
  return <Component className={cn("cyber-gradient font-bold", className)}>{children}</Component>
}

export function GlassCard({
  children,
  className,
  glowing = false,
}: {
  children: React.ReactNode
  className?: string
  glowing?: boolean
}) {
  return <div className={cn("glass-effect rounded-lg p-6", glowing && "glow-effect", className)}>{children}</div>
}

export function HexagonIcon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/20 stroke-primary" strokeWidth="2">
        <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export function GridBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid-bg", className)}>{children}</div>
}
