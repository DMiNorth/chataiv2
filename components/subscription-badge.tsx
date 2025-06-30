"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Calendar, CheckCircle, AlertTriangle, Crown, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"
import { useSubscription } from "@/hooks/use-subscription"

interface SubscriptionBadgeProps {
  variant?: "compact" | "full"
  className?: string
  onUpgrade?: () => void
}

export default function SubscriptionBadge({ variant = "compact", className = "", onUpgrade }: SubscriptionBadgeProps) {
  const { actualTheme } = useTheme()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isDark = actualTheme === "dark"
  const { showError } = useNotifications()
  const subscription = useSubscription()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Мокаем текущую подписку с активным сроком
  const currentSubscription = {
    name: "Продвинутая",
    icon: Zap,
    color: "from-[#FF9500] to-[#34C759]",
    expiryDate: "2025-08-15",
    features: [
      "SWOT с рыночными трендами",
      "Прогнозы роста (до 3/мес.)",
      "Анализ конкурентов (до 3/мес.)",
      "Интеграции: Google Analytics, Яндекс.Метрика",
      "AI-контент (до 15 постов/мес.)",
      "Управление задачами (до 10/мес.)",
      "Воронки (до 3 этапов)",
      "Аудиоответы",
    ],
  }

  const Icon = currentSubscription.icon
  const daysLeft = Math.ceil(
    (new Date(currentSubscription.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  const isExpired = daysLeft < 0
  const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0

  const getStatusInfo = () => {
    if (isExpired) {
      return {
        text: "Истекла",
        color: "bg-red-500",
        textColor: "text-white",
        icon: AlertTriangle,
        message: "Подписка истекла! Продлите для продолжения работы",
      }
    } else if (isExpiringSoon) {
      return {
        text: `${daysLeft} дн.`,
        color: "bg-orange-500",
        textColor: "text-white",
        icon: AlertTriangle,
        message: `Подписка истекает через ${daysLeft} дней`,
      }
    } else {
      return {
        text: `${daysLeft} дн.`,
        color: `bg-gradient-to-r ${currentSubscription.color}`,
        textColor: "text-white",
        icon: Icon,
        message: `Подписка активна еще ${daysLeft} дней`,
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const handleDetailsClick = () => {
    setIsDetailsOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsOpen(false)
  }

  // Компонент модального окна
  const ModalContent = () => (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      style={{ zIndex: 99999 }}
      onClick={handleCloseModal}
    >
      <div
        className={`max-w-sm w-full my-4 rounded-xl shadow-2xl transform transition-all duration-300 scale-100 theme-transition ${
          isDark ? "bg-gray-800 border border-gray-700 text-white" : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div
          className={`p-4 rounded-t-xl ${
            isExpired ? "bg-gradient-to-r from-red-500 to-red-600" : `bg-gradient-to-r ${currentSubscription.color}`
          } text-white relative overflow-hidden flex-shrink-0`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                <StatusIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold">{isExpired ? "Подписка истекла" : currentSubscription.name}</h2>
                <p className="text-white/80 text-xs">{isExpired ? "Требуется продление" : "Активная подписка"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="rounded-full w-8 h-8 p-0 text-white hover:bg-white/20 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[50vh] overflow-y-auto">
          <div className="p-4 space-y-4">
            {isExpired ? (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-600 dark:text-red-400">Доступ ограничен</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Подписка истекла {Math.abs(daysLeft)} дней назад. Продлите для продолжения работы.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Compact Status Info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">До</span>
                      <div className="text-sm font-bold">
                        {new Date(currentSubscription.expiryDate).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      isExpiringSoon
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    }
                  >
                    {daysLeft} дн.
                  </Badge>
                </div>

                {/* Warning for expiring soon */}
                {isExpiringSoon && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                      <span className="font-medium text-xs text-orange-700 dark:text-orange-400">Скоро истечет!</span>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-300 mb-2">Продлите со скидкой 20%</p>
                    <Button
                      onClick={() => {
                        handleCloseModal()
                        onUpgrade?.()
                      }}
                      size="sm"
                      className="w-full bg-gradient-to-r from-[#FF9500] to-[#0088CC] text-white text-xs"
                    >
                      Продлить со скидкой
                    </Button>
                  </div>
                )}

                {/* Compact Features */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-gray-900 dark:text-white">Доступные функции:</h4>
                  <div className="space-y-2">
                    {currentSubscription.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact Additional Info */}
                <div
                  className={`p-3 rounded-lg border theme-transition ${
                    isDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2 text-xs">💡 Дополнительно:</h5>
                  <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Приоритетная поддержка</li>
                    <li>• Ранний доступ к новинкам</li>
                    <li>• Персональные консультации</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compact Fixed Footer */}
        <div
          className={`p-4 border-t rounded-b-xl flex-shrink-0 theme-transition ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div className="space-y-2">
            {isExpired ? (
              <Button
                onClick={() => {
                  handleCloseModal()
                  onUpgrade?.()
                }}
                className="w-full bg-gradient-to-r from-[#0088CC] to-[#34C759] hover:from-[#0077B3] hover:to-[#2FB344] text-white font-medium text-sm py-2"
              >
                <Crown className="w-4 h-4 mr-2" />
                Продлить подписку
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    handleCloseModal()
                    onUpgrade?.()
                  }}
                  className="w-full bg-gradient-to-r from-[#0088CC] to-[#34C759] hover:from-[#0077B3] hover:to-[#2FB344] text-white font-medium text-sm"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Изменить план
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className={`w-full text-sm theme-transition ${
                    isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Закрыть
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (variant === "compact") {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailsClick}
          className={`h-8 px-3 ${statusInfo.color} ${statusInfo.textColor} hover:opacity-90 transition-all duration-300 shadow-lg ${className}`}
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">{isExpired ? "Истекла" : currentSubscription.name}</span>
        </Button>

        {/* Модальное окно через портал */}
        {isMounted && isDetailsOpen && createPortal(<ModalContent />, document.body)}
      </>
    )
  }

  return (
    <div className={`p-3 ${statusInfo.color} rounded-xl ${statusInfo.textColor} shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <StatusIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">{isExpired ? "Подписка истекла" : currentSubscription.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailsClick}
          className="text-white hover:bg-white/20 h-6 px-2 rounded-lg"
        >
          <span className="text-xs">Детали</span>
        </Button>
      </div>
      <div className="text-xs opacity-90">
        {isExpired
          ? `Истекла ${Math.abs(daysLeft)} дней назад`
          : `До ${new Date(currentSubscription.expiryDate).toLocaleDateString("ru-RU")} • ${daysLeft} дней`}
      </div>

      {(isExpired || isExpiringSoon) && (
        <Button
          onClick={onUpgrade}
          size="sm"
          className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg"
        >
          {isExpired ? "Продлить" : "Продлить со скидкой"}
        </Button>
      )}

      {/* Модальное окно для full варианта */}
      {isMounted && isDetailsOpen && createPortal(<ModalContent />, document.body)}
    </div>
  )
}
