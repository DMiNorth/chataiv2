"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import SwotAnalysis from "@/components/swot-analysis"
import ChartsSection from "@/components/charts-section"
import SubscriptionModal from "@/components/subscription-modal"
import SubscriptionBadge from "@/components/subscription-badge"
import { useState, useEffect } from "react"
import { generateAnalyticsPDF } from "@/lib/pdf-generator"
import PDFPreviewModal from "@/components/pdf-preview-modal"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"
import { Skeleton, CardSkeleton, ChartSkeleton } from "@/components/skeleton"
import { useSubscription } from "@/hooks/use-subscription"

export default function AnalyticsScreen() {
  const { actualTheme } = useTheme()
  const { showSuccess, showError, showLoading, hideNotification } = useNotifications()
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState({
    profile: false,
    stats: false,
    swot: false,
    charts: false,
  })

  const isDark = actualTheme === "dark"
  const subscription = useSubscription()

  const analyticsData = {
    profile: {
      name: "Александр Иванов",
      position: "Предприниматель",
      projects: 156,
      successRate: 89,
    },
    stats: [
      { label: "Рост", value: "+24%", icon: "📈" },
      { label: "Клиенты", value: "1,234", icon: "👥" },
      { label: "Доход", value: "₽125K", icon: "💰" },
      { label: "Цели", value: "8/10", icon: "🎯" },
    ],
    swot: {
      strengths: ["Опытная команда", "Уникальный продукт", "Сильный бренд"],
      weaknesses: ["Ограниченный бюджет", "Малая команда", "Новый рынок"],
      opportunities: ["Рост рынка", "Новые технологии", "Партнерства"],
      threats: ["Конкуренты", "Экономический кризис", "Изменения в законах"],
    },
    chartData: {
      growth: [
        { month: "Янв", value: 65 },
        { month: "Фев", value: 78 },
        { month: "Мар", value: 82 },
        { month: "Апр", value: 75 },
        { month: "Май", value: 90 },
        { month: "Июн", value: 95 },
      ],
      distribution: [
        { label: "Продажи", value: 45 },
        { label: "Маркетинг", value: 30 },
        { label: "Разработка", value: 25 },
      ],
    },
  }

  // Симуляция асинхронной загрузки данных
  useEffect(() => {
    const loadData = async () => {
      // Загрузка профиля
      setTimeout(() => {
        setDataLoaded((prev) => ({ ...prev, profile: true }))
      }, 800)

      // Загрузка статистики
      setTimeout(() => {
        setDataLoaded((prev) => ({ ...prev, stats: true }))
      }, 1200)

      // Загрузка SWOT
      setTimeout(() => {
        setDataLoaded((prev) => ({ ...prev, swot: true }))
      }, 1600)

      // Загрузка графиков
      setTimeout(() => {
        setDataLoaded((prev) => ({ ...prev, charts: true }))
        setIsLoading(false)
      }, 2000)
    }

    loadData()
  }, [])

  const handleDownloadPDF = async () => {
    if (subscription?.isExpired) {
      showError("Доступ ограничен", "Для скачивания PDF необходимо продлить подписку")
      return
    }

    setIsGeneratingPDF(true)
    const loadingId = showLoading("Создание PDF отчета...")

    try {
      await generateAnalyticsPDF(analyticsData)
      hideNotification(loadingId)
      showSuccess("PDF создан", "Отчет успешно скачан")
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка создания PDF", error instanceof Error ? error.message : "Неизвестная ошибка")
    } finally {
      setIsGeneratingPDF(false)
      setIsPDFPreviewOpen(false)
    }
  }

  const handlePreviewPDF = () => {
    if (subscription?.isExpired) {
      showError("Доступ ограничен", "Для предпросмотра PDF необходимо продлить подписку")
      return
    }
    setIsPDFPreviewOpen(true)
  }

  const handleUpgrade = () => {
    setIsSubscriptionModalOpen(true)
  }

  return (
    <div
      className={`min-h-screen theme-transition p-4 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-[#F0F2F5] to-white"}`}
    >
      {/* Header */}
      <div className="mb-6 pt-4">
        <h1 className={`text-2xl font-bold mb-2 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          📊 Аналитика
        </h1>
        <p className={`theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Обзор вашей деятельности и планы развития
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          {!dataLoaded.profile ? (
            <CardSkeleton />
          ) : (
            <Card
              className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl theme-transition ${
                isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              } animate-fade-in`}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0088CC] to-[#34C759] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">АИ</span>
                </div>
                <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                  {analyticsData.profile.name}
                </CardTitle>
                <p className={`text-sm theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {analyticsData.profile.position}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[#0088CC]/10 rounded-xl">
                    <div className="text-2xl font-bold text-[#0088CC]">{analyticsData.profile.projects}</div>
                    <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Проектов
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#34C759]/10 rounded-xl">
                    <div className="text-2xl font-bold text-[#34C759]">{analyticsData.profile.successRate}%</div>
                    <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Успешность
                    </div>
                  </div>
                </div>

                {/* Subscription Badge */}
                <SubscriptionBadge variant="full" className="mb-4" onUpgrade={handleUpgrade} />

                <div className="space-y-3">
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-[#0088CC] to-[#34C759] hover:from-[#0077B3] hover:to-[#2FB344] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Получить план
                  </Button>
                  <Button
                    onClick={handlePreviewPDF}
                    variant="outline"
                    className={`w-full transition-all duration-300 theme-transition ${
                      isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-50"
                    } ${subscription?.isExpired ? "opacity-50" : ""}`}
                    disabled={subscription?.isExpired}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Предпросмотр PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analyticsData.stats.map((stat, index) => (
              <div key={index}>
                {!dataLoaded.stats ? (
                  <div
                    className={`p-4 rounded-lg border theme-transition ${
                      isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
                    }`}
                  >
                    <Skeleton variant="text" width="2rem" height="2rem" className="mx-auto mb-2" />
                    <Skeleton variant="text" width="60%" height="1.5rem" className="mx-auto mb-1" />
                    <Skeleton variant="text" width="40%" height="0.75rem" className="mx-auto" />
                  </div>
                ) : (
                  <Card
                    className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 theme-transition animate-fade-in ${
                      isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className={`text-lg font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>

          {/* SWOT Analysis */}
          {!dataLoaded.swot ? (
            <ChartSkeleton />
          ) : (
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <SwotAnalysis />
            </div>
          )}

          {/* Charts */}
          {!dataLoaded.charts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          ) : (
            <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              <ChartsSection />
            </div>
          )}
        </div>
      </div>

      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        onDownload={handleDownloadPDF}
        isGenerating={isGeneratingPDF}
      />
    </div>
  )
}
