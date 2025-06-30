"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Mail, CheckSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"
import ContentTool from "@/components/content-tool"
import EmailTool from "@/components/email-tool"
import TasksTool from "@/components/tasks-tool"
import { CardSkeleton } from "@/components/skeleton"
import { useSubscription } from "@/hooks/use-subscription"
import { useNotifications } from "@/components/notification-system"

export default function ToolsScreen() {
  const { actualTheme } = useTheme()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isDark = actualTheme === "dark"

  const subscription = useSubscription()
  const { showError } = useNotifications()

  const tools = [
    {
      icon: FileText,
      title: "Контент",
      description: "Создание и управление контентом",
      color: "bg-gradient-to-br from-[#0088CC] to-[#34C759]",
      tasks: 12,
    },
    {
      icon: Mail,
      title: "Рассылки",
      description: "Email и SMS маркетинг",
      color: "bg-gradient-to-br from-[#34C759] to-[#FF9500]",
      tasks: 8,
    },
    {
      icon: CheckSquare,
      title: "Задачи",
      description: "Планирование и контроль",
      color: "bg-gradient-to-br from-[#FF9500] to-[#0088CC]",
      tasks: 15,
    },
  ]

  useEffect(() => {
    // Симуляция загрузки инструментов
    const loadTools = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsLoading(false)
    }

    loadTools()
  }, [])

  const handleOpenTool = (toolName: string) => {
    if (subscription?.isExpired) {
      showError("Доступ ограничен", `Для использования инструмента "${toolName}" необходимо продлить подписку`)
      return
    }
    setActiveTool(toolName.toLowerCase())
  }

  return (
    <div
      className={`min-h-screen p-4 theme-transition ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-[#F0F2F5] to-white"}`}
    >
      {/* Header */}
      <div className="mb-6 pt-4">
        <h1 className={`text-2xl font-bold mb-2 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          🛠 Инструменты
        </h1>
        <p className={`theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Управление проектами и финансами
        </p>
      </div>

      <div className="space-y-6 pb-8">
        {/* Tools Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            tools.map((tool, index) => (
              <Card
                key={index}
                className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer theme-transition animate-fade-in ${
                  isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    {tool.title}
                  </CardTitle>
                  <p className={`text-sm theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {tool.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 theme-transition ${
                        isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tool.tasks} задач
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenTool(tool.title)}
                      className={`text-[#0088CC] hover:bg-[#0088CC]/10 rounded-full ${
                        subscription?.isExpired ? "opacity-50" : ""
                      }`}
                      disabled={subscription?.isExpired}
                    >
                      {subscription?.isExpired ? "Заблокировано" : "Открыть"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tool Content */}
        {activeTool && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => setActiveTool(null)}
                className={`mb-4 theme-transition ${
                  isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                ← Назад к инструментам
              </Button>
            </div>

            {activeTool === "контент" && <ContentTool />}
            {activeTool === "рассылки" && <EmailTool />}
            {activeTool === "задачи" && <TasksTool />}
          </div>
        )}
      </div>
    </div>
  )
}
