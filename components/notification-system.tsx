"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "loading"
  title: string
  message?: string
  duration?: number
  startTime?: number
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
  showLoading: (title: string, message?: string) => string
  hideNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

function NotificationItem({ notification, onHide }: { notification: Notification; onHide: (id: string) => void }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (notification.type === "loading" || notification.duration === 0) return

    const duration = notification.duration || 5000
    const startTime = notification.startTime || Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      const progressPercent = (remaining / duration) * 100

      setProgress(progressPercent)

      if (remaining <= 0) {
        onHide(notification.id)
      }
    }

    const interval = setInterval(updateProgress, 50)
    return () => clearInterval(interval)
  }, [notification, onHide])

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "loading":
        return "bg-blue-50 border-blue-200"
    }
  }

  const getProgressColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
      case "loading":
        return "bg-blue-500"
    }
  }

  return (
    <div
      className={`relative p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-up overflow-hidden ${getBackgroundColor(notification.type)}`}
    >
      <div className="flex items-start space-x-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
          {notification.message && <p className="text-xs text-gray-600 mt-1">{notification.message}</p>}
        </div>
        {notification.type !== "loading" && (
          <button
            onClick={() => onHide(notification.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {notification.type !== "loading" && notification.duration !== 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-75 ease-linear ${getProgressColor(notification.type)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    const newNotification = {
      ...notification,
      id,
      startTime: Date.now(),
    }

    setNotifications((prev) => [...prev, newNotification])
    return id
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "success", title, message })
    },
    [showNotification],
  )

  const showError = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "error", title, message })
    },
    [showNotification],
  )

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "info", title, message })
    },
    [showNotification],
  )

  const showLoading = useCallback(
    (title: string, message?: string) => {
      return showNotification({ type: "loading", title, message, duration: 0 })
    },
    [showNotification],
  )

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showLoading,
        hideNotification,
      }}
    >
      {children}

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onHide={hideNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
