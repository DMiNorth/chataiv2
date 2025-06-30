"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Crown, Lock, Zap, X, CheckCircle } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

interface SubscriptionExpiredModalProps {
  isOpen: boolean
  onUpgrade: () => void
}

export default function SubscriptionExpiredModal({ isOpen, onUpgrade }: SubscriptionExpiredModalProps) {
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"

  const blockedFeatures = [
    "📊 Аналитика и отчеты",
    "🤖 AI-чат и помощник",
    "📧 Email рассылки",
    "📝 Управление контентом",
    "✅ Планирование задач",
    "📈 SWOT анализ",
    "📋 PDF экспорт",
    "🔗 Интеграции",
  ]

  const premiumFeatures = [
    "Безлимитный AI-чат",
    "Продвинутая аналитика",
    "Автоматические отчеты",
    "Приоритетная поддержка",
    "Все интеграции",
    "Экспорт в любых форматах",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className={`max-w-2xl max-h-[90vh] overflow-y-auto border-0 theme-transition ${
          isDark ? "bg-gray-800" : "bg-white"
        } [&>button]:hidden`}
      >
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 text-white p-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Подписка истекла!</h1>
              <p className="text-base opacity-90">Все функции заморожены до продления</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Alert */}
            <div
              className={`p-4 rounded-xl border-2 border-red-200 theme-transition ${
                isDark ? "bg-red-900/20 border-red-800" : "bg-red-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className={`font-bold text-sm theme-transition ${isDark ? "text-red-400" : "text-red-700"}`}>
                    Доступ ограничен
                  </h3>
                  <p className={`text-xs theme-transition ${isDark ? "text-red-300" : "text-red-600"}`}>
                    Ваша подписка "Продвинутая" истекла 5 дней назад. Продлите для восстановления доступа.
                  </p>
                </div>
              </div>
            </div>

            {/* Blocked Features */}
            <div>
              <h3 className={`font-bold text-base mb-3 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                🚫 Заблокированные функции:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {blockedFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-lg border theme-transition ${
                      isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <X className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                    <span className={`text-xs theme-transition ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offer */}
            <div className="relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 z-10 text-xs">
                🔥 Специальное предложение
              </Badge>
              <div
                className={`p-5 rounded-2xl border-2 theme-transition ${
                  isDark
                    ? "bg-gradient-to-br from-gray-700 to-gray-800 border-orange-600"
                    : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-300"
                }`}
              >
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Crown className="w-5 h-5 text-orange-500" />
                    <h3 className={`text-lg font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                      Продлить со скидкой 30%
                    </h3>
                  </div>
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-2xl font-bold text-orange-500">1750₽</span>
                    <span className="text-base text-gray-500 line-through">2500₽</span>
                    <span className="text-sm text-gray-600">/мес</span>
                  </div>
                  <p className={`text-xs mt-2 theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    ⏰ Предложение действует только 24 часа
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className={`font-semibold text-sm theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    ✨ Что вы получите:
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span className={`text-xs theme-transition ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Выбрать план подписки
                </Button>
              </div>
            </div>

            {/* Alternative Plans */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-xl border theme-transition ${
                  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-center">
                  <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <h4 className={`font-bold text-sm theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    Базовая
                  </h4>
                  <p className="text-lg font-bold text-blue-500">1000₽</p>
                  <p className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>/месяц</p>
                  <Button
                    onClick={onUpgrade}
                    variant="outline"
                    size="sm"
                    className={`w-full mt-2 text-xs theme-transition ${
                      isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Выбрать
                  </Button>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border theme-transition ${
                  isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-center">
                  <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <h4 className={`font-bold text-sm theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    Премиум
                  </h4>
                  <p className="text-lg font-bold text-purple-500">5000₽</p>
                  <p className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>/месяц</p>
                  <Button
                    onClick={onUpgrade}
                    variant="outline"
                    size="sm"
                    className={`w-full mt-2 text-xs theme-transition ${
                      isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Выбрать
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`text-center p-3 rounded-lg theme-transition ${isDark ? "bg-gray-700/30" : "bg-gray-50"}`}>
              <p className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                💡 <strong>Совет:</strong> Продлите сейчас и получите дополнительную неделю бесплатно!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
