"use client"

import { useTheme } from "@/hooks/use-theme"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ className = "", variant = "rectangular", width, height, lines = 1 }: SkeletonProps) {
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"

  const baseClasses = `animate-pulse ${isDark ? "bg-gray-700" : "bg-gray-200"}`

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  }

  const style = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "auto"),
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
              ...style,
              width: index === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    )
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />
}

export function CardSkeleton() {
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"

  return (
    <div
      className={`p-6 rounded-lg border theme-transition ${
        isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} className="mt-2" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-between items-center mt-4">
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={100} height={32} />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"

  return (
    <div
      className={`p-6 rounded-lg border theme-transition ${
        isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
      }`}
    >
      <Skeleton variant="text" width="50%" height={24} className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="flex justify-between mt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="text" width={40} height={16} />
        ))}
      </div>
    </div>
  )
}
