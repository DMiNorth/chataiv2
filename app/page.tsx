"use client"

import { useState } from "react"
import { MessageCircle, BarChart3, Wrench } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import ChatScreen from "@/components/chat-screen"
import AnalyticsScreen from "@/components/analytics-screen"
import ToolsScreen from "@/components/tools-screen"
import SubscriptionExpiredModal from "@/components/subscription-expired-modal"
import SubscriptionModal from "@/components/subscription-modal"
import { useSubscription } from "@/hooks/use-subscription"

export default function TelegramMiniApp() {
  const { actualTheme } = useTheme()
  const subscription = useSubscription()
  const [activeTab, setActiveTab] = useState("chat")
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const isDark = actualTheme === "dark"

  // Показываем модальное окно истекшей подписки только если подписка действительно истекла
  const showExpiredModal = subscription?.isExpired === true

  const tabs = [
    { id: "chat", label: "Чат", icon: MessageCircle },
    { id: "analytics", label: "Аналитика", icon: BarChart3 },
    { id: "tools", label: "Инструменты", icon: Wrench },
  ]

  const handleUpgradeFromExpiredModal = () => {
    // Открываем модальное окно выбора подписки
    setIsSubscriptionModalOpen(true)
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "chat":
        return <ChatScreen />
      case "analytics":
        return <AnalyticsScreen />
      case "tools":
        return <ToolsScreen />
      default:
        return <ChatScreen />
    }
  }

  return (
    <div className={`min-h-screen flex flex-col theme-transition ${isDark ? "bg-gray-900" : "bg-[#F0F2F5]"}`}>
      {/* Main Content */}
      <div className="flex-1 pb-20">{renderScreen()}</div>

      {/* Bottom Navigation - Always visible */}
      <div
        className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t shadow-lg theme-transition ${
          isDark ? "bg-gray-800/95 border-gray-700/50" : "bg-white/95 border-gray-200/50"
        }`}
      >
        <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-[#0088CC] bg-[#0088CC]/10"
                    : isDark
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
                style={{
                  minWidth: '80px', // Фиксированная минимальная ширина
                  flex: '1 1 0%'    // Равномерное распределение
                }}
              >
                <div className={`w-6 h-6 flex items-center justify-center mb-1 ${isActive ? "animate-pulse" : ""}`}>
                  <Icon className="w-full h-full" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Subscription Modals */}
      <SubscriptionExpiredModal isOpen={showExpiredModal} onUpgrade={handleUpgradeFromExpiredModal} />
      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
    </div>
  )
}
