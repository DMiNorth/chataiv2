"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Users, BarChart } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"

interface Campaign {
  id: string
  name: string
  subject: string
  status: string
  sent: number
  opened: number
  clicked: number
  date: string
}

export default function EmailTool() {
  const { actualTheme } = useTheme()
  const { showSuccess, showError, showLoading, hideNotification } = useNotifications()
  const isDark = actualTheme === "dark"

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Новогодняя акция",
      subject: "🎄 Скидки до 50% на все товары!",
      status: "Отправлена",
      sent: 1250,
      opened: 875,
      clicked: 156,
      date: "2024-01-10",
    },
    {
      id: "2",
      name: "Еженедельная рассылка",
      subject: "Новости недели и полезные советы",
      status: "Черновик",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "2024-01-15",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    content: "",
  })

  const handleCreate = async () => {
    if (!newCampaign.name.trim() || !newCampaign.subject.trim()) {
      showError("Ошибка создания", "Заполните название и тему рассылки")
      return
    }

    const loadingId = showLoading("Создание рассылки...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        subject: newCampaign.subject,
        status: "Черновик",
        sent: 0,
        opened: 0,
        clicked: 0,
        date: new Date().toISOString().split("T")[0],
      }

      setCampaigns([campaign, ...campaigns])
      setNewCampaign({ name: "", subject: "", content: "" })
      setIsCreating(false)

      hideNotification(loadingId)
      showSuccess("Рассылка создана", `"${campaign.name}" готова к отправке`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка создания", "Не удалось создать рассылку")
    }
  }

  const handleSend = async (id: string) => {
    const campaign = campaigns.find((c) => c.id === id)
    if (!campaign) return

    const loadingId = showLoading("Отправка рассылки...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCampaigns(
        campaigns.map((c) =>
          c.id === id ? { ...c, status: "Отправлена", sent: Math.floor(Math.random() * 1000) + 500 } : c,
        ),
      )

      hideNotification(loadingId)
      showSuccess("Рассылка отправлена", `"${campaign.name}" успешно отправлена`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка отправки", "Не удалось отправить рассылку")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          📧 Email рассылки
        </h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-[#34C759] to-[#FF9500] hover:from-[#2FB344] hover:to-[#E6850E]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новая рассылка
        </Button>
      </div>

      {isCreating && (
        <Card
          className={`backdrop-blur-sm border-0 shadow-lg theme-transition ${
            isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
          }`}
        >
          <CardHeader>
            <CardTitle className={`theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
              Новая рассылка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название кампании"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <Input
              placeholder="Тема письма"
              value={newCampaign.subject}
              onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <Textarea
              placeholder="Содержание письма"
              value={newCampaign.content}
              onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
              rows={6}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <div className="flex space-x-2">
              <Button onClick={handleCreate}>Создать</Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className={`theme-transition ${isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : ""}`}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className={`backdrop-blur-sm border-0 shadow-lg theme-transition ${
              isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    {campaign.name}
                  </CardTitle>
                  <p className={`text-sm mt-1 theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {campaign.subject}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={
                      campaign.status === "Отправлена"
                        ? "bg-[#34C759]/10 text-[#34C759]"
                        : isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                    }
                  >
                    {campaign.status}
                  </Badge>
                  {campaign.status === "Черновик" && (
                    <Button
                      size="sm"
                      onClick={() => handleSend(campaign.id)}
                      className="bg-[#34C759] hover:bg-[#2FB344]"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Отправить
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {campaign.status === "Отправлена" && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-[#0088CC]/10 rounded-xl">
                    <Users className="w-5 h-5 text-[#0088CC] mx-auto mb-1" />
                    <div className="text-lg font-bold text-[#0088CC]">{campaign.sent}</div>
                    <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Отправлено
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#34C759]/10 rounded-xl">
                    <BarChart className="w-5 h-5 text-[#34C759] mx-auto mb-1" />
                    <div className="text-lg font-bold text-[#34C759]">{campaign.opened}</div>
                    <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Открыто
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#FF9500]/10 rounded-xl">
                    <Send className="w-5 h-5 text-[#FF9500] mx-auto mb-1" />
                    <div className="text-lg font-bold text-[#FF9500]">{campaign.clicked}</div>
                    <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Кликов
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
