"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Crown, Star, Zap } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"
  const { showSuccess } = useNotifications()

  const plans = [
    {
      id: "basic",
      name: "Базовая",
      price: "1000₽",
      period: "/мес",
      icon: Star,
      color: "from-[#34C759] to-[#0088CC]",
      description: "Для начинающих предпринимателей",
      features: [
        "Базовый SWOT-анализ и рекомендации",
        "До 5 AI-постов в месяц",
        "План роста (до 5 шагов)",
        "Микрообучение в чате",
        "Голосовой ввод",
        "Опросы (до 3/мес.)",
        "Доступ к mini app (личный чат)",
      ],
      limitations: [
        "Нет интеграций",
        "Нет прогнозов роста",
        "Нет анализа конкурентов",
        "Нет бренд-мониторинга",
        "Нет AI для переговоров",
      ],
    },
    {
      id: "advanced",
      name: "Продвинутая",
      price: "2500₽",
      period: "/мес",
      icon: Zap,
      color: "from-[#FF9500] to-[#34C759]",
      description: "Для малого и среднего бизнеса",
      popular: true,
      features: [
        "Всё из Базовой подписки",
        "SWOT с рыночными трендами",
        "Прогнозы роста (до 3/мес.)",
        "Анализ конкурентов (до 3/мес.)",
        "Интеграции: Google Analytics, Яндекс.Метрика, 1 CRM",
        "План роста (до 10 шагов)",
        "Управление задачами (до 10/мес.)",
        "Воронки (до 3 этапов)",
        "AI-контент (до 15 постов/мес.)",
        "Аудиоответы",
        "Интерактивные дашборды",
      ],
      limitations: ["Нет AI-переговорщика", "Нет бренд-мониторинга", "Ограниченные функции"],
    },
    {
      id: "premium",
      name: "Премиум",
      price: "5000₽",
      period: "/мес",
      icon: Crown,
      color: "from-[#0088CC] to-[#FF9500]",
      description: "Для опытных предпринимателей и компаний",
      features: [
        "Всё из Продвинутой подписки",
        "Безлимитный анализ конкурентов и прогнозы",
        "Интеграция с любыми CRM, SimilarWeb",
        "Сравнение с отраслевыми метриками",
        "Полная автоматизация воронок и задач",
        "Финансовый учет",
        "Мониторинг бренда (Telegram, X и др.)",
        "Безлимитные рассылки, посты, розыгрыши",
        "AI-ассистент для переговоров",
        "Генератор идей, многоязычная поддержка",
        "Приоритетная поддержка",
      ],
      limitations: [],
    },
  ]

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    // Здесь будет логика оплаты
    setTimeout(() => {
      // Симулируем успешную оплату и обновление подписки
      showSuccess("Подписка активирована!", `Подписка "${plans.find((p) => p.id === planId)?.name}" успешно оформлена!`)
      onClose()
      setSelectedPlan(null)
      // Здесь можно добавить обновление статуса подписки
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-5xl max-h-[85vh] overflow-y-auto theme-transition ${
          isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-xl font-bold text-center mb-3 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}
          >
            🚀 Выберите подписку
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 theme-transition ${
                  plan.popular
                    ? "border-[#FF9500] bg-gradient-to-b from-[#FF9500]/5 to-transparent"
                    : isDark
                      ? "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                } hover:shadow-lg`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#FF9500] text-white px-3 py-1 text-xs">
                    Популярный
                  </Badge>
                )}

                <div className="text-center mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold mb-1 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-3 theme-transition ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1 text-sm">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                      <Check className="w-3 h-3 text-[#34C759] mr-1" />
                      Преимущества:
                    </h4>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start text-xs text-gray-700">
                          <Check className="w-3 h-3 text-[#34C759] mr-1 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-xs text-gray-500 italic">
                          +{plan.features.length - 4} дополнительных функций
                        </li>
                      )}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                        <X className="w-3 h-3 text-red-500 mr-1" />
                        Ограничения:
                      </h4>
                      <ul className="space-y-1">
                        {plan.limitations.slice(0, 2).map((limitation, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-600">
                            <X className="w-3 h-3 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm`}
                >
                  {selectedPlan === plan.id ? "Оформляем..." : "Выбрать план"}
                </Button>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
