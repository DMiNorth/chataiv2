"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Calendar, Eye } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"

interface ContentItem {
  id: string
  title: string
  type: string
  status: string
  date: string
  content: string
}

export default function ContentTool() {
  const { actualTheme } = useTheme()
  const { showSuccess, showError, showLoading, hideNotification } = useNotifications()
  const isDark = actualTheme === "dark"

  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: "1",
      title: "Пост о новом продукте",
      type: "Instagram",
      status: "Готов",
      date: "2024-01-15",
      content: "Представляем наш новый продукт! 🚀 Инновационное решение для вашего бизнеса.",
    },
    {
      id: "2",
      title: "Статья в блог",
      type: "Blog",
      status: "В работе",
      date: "2024-01-16",
      content: "Как увеличить продажи в 2024 году: 10 проверенных стратегий...",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [viewingContent, setViewingContent] = useState<ContentItem | null>(null)
  const [newContent, setNewContent] = useState({
    title: "",
    type: "Instagram",
    content: "",
  })

  const handleCreate = async () => {
    if (!newContent.title.trim() || !newContent.content.trim()) {
      showError("Ошибка создания", "Заполните все обязательные поля")
      return
    }

    const loadingId = showLoading("Создание контента...")

    try {
      // Симуляция создания
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const content: ContentItem = {
        id: Date.now().toString(),
        title: newContent.title,
        type: newContent.type,
        status: "Черновик",
        date: new Date().toISOString().split("T")[0],
        content: newContent.content,
      }

      setContents([content, ...contents])
      setNewContent({ title: "", type: "Instagram", content: "" })
      setIsCreating(false)

      hideNotification(loadingId)
      showSuccess("Контент создан", `"${content.title}" успешно добавлен`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка создания", "Не удалось создать контент")
    }
  }

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content)
  }

  const handleSaveEdit = async () => {
    if (!editingContent) return

    const loadingId = showLoading("Сохранение изменений...")

    try {
      // Симуляция сохранения
      await new Promise((resolve) => setTimeout(resolve, 800))

      setContents(contents.map((c) => (c.id === editingContent.id ? editingContent : c)))
      setEditingContent(null)

      hideNotification(loadingId)
      showSuccess("Изменения сохранены", "Контент успешно обновлен")
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка сохранения", "Не удалось сохранить изменения")
    }
  }

  const handleView = (content: ContentItem) => {
    setViewingContent(content)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот контент?")) return

    const loadingId = showLoading("Удаление контента...")

    try {
      // Симуляция удаления
      await new Promise((resolve) => setTimeout(resolve, 500))

      const deletedContent = contents.find((c) => c.id === id)
      setContents(contents.filter((c) => c.id !== id))

      hideNotification(loadingId)
      showSuccess("Контент удален", `"${deletedContent?.title}" удален`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка удаления", "Не удалось удалить контент")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          📝 Управление контентом
        </h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-[#0088CC] to-[#34C759] hover:from-[#0077B3] hover:to-[#2FB344]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать контент
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
              Новый контент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название контента"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <select
              className={`w-full p-2 border rounded-lg theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
              }`}
              value={newContent.type}
              onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Blog">Blog</option>
              <option value="Email">Email</option>
            </select>
            <Textarea
              placeholder="Содержание контента"
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              rows={4}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contents.map((content) => (
          <Card
            key={content.id}
            className={`backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 theme-transition ${
              isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                  {content.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(content)}
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(content)}
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(content.id)}
                    className="rounded-full w-8 h-8 p-0 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-[#0088CC]/10 text-[#0088CC]">
                    {content.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      content.status === "Готов"
                        ? "bg-[#34C759]/10 text-[#34C759]"
                        : content.status === "В работе"
                          ? "bg-[#FF9500]/10 text-[#FF9500]"
                          : isDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                    }
                  >
                    {content.status}
                  </Badge>
                </div>
                <p className={`text-sm line-clamp-2 theme-transition ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {content.content}
                </p>
                <div
                  className={`flex items-center text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(content.date).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className={`max-w-2xl theme-transition ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
          <DialogHeader>
            <DialogTitle className={`theme-transition ${isDark ? "text-white" : ""}`}>
              Редактировать контент
            </DialogTitle>
          </DialogHeader>
          {editingContent && (
            <div className="space-y-4">
              <Input
                placeholder="Название контента"
                value={editingContent.title}
                onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
              <select
                className={`w-full p-2 border rounded-lg theme-transition ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                }`}
                value={editingContent.type}
                onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value })}
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Blog">Blog</option>
                <option value="Email">Email</option>
              </select>
              <select
                className={`w-full p-2 border rounded-lg theme-transition ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                }`}
                value={editingContent.status}
                onChange={(e) => setEditingContent({ ...editingContent, status: e.target.value })}
              >
                <option value="Черновик">Черновик</option>
                <option value="В работе">В работе</option>
                <option value="Готов">Готов</option>
              </select>
              <Textarea
                placeholder="Содержание контента"
                value={editingContent.content}
                onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                rows={6}
                className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit}>Сохранить</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingContent(null)}
                  className={`theme-transition ${isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : ""}`}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewingContent} onOpenChange={() => setViewingContent(null)}>
        <DialogContent className={`max-w-2xl theme-transition ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
          <DialogHeader>
            <DialogTitle className={`theme-transition ${isDark ? "text-white" : ""}`}>Просмотр контента</DialogTitle>
          </DialogHeader>
          {viewingContent && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg theme-transition ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className={`font-bold text-lg mb-2 theme-transition ${isDark ? "text-white" : ""}`}>
                  {viewingContent.title}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="bg-[#0088CC]/10 text-[#0088CC]">
                    {viewingContent.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      viewingContent.status === "Готов"
                        ? "bg-[#34C759]/10 text-[#34C759]"
                        : viewingContent.status === "В работе"
                          ? "bg-[#FF9500]/10 text-[#FF9500]"
                          : isDark
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                    }
                  >
                    {viewingContent.status}
                  </Badge>
                </div>
                <p className={`whitespace-pre-wrap theme-transition ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {viewingContent.content}
                </p>
                <div
                  className={`flex items-center text-sm mt-3 theme-transition ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Создано: {new Date(viewingContent.date).toLocaleDateString("ru-RU")}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setViewingContent(null)
                    handleEdit(viewingContent)
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewingContent(null)}
                  className={`theme-transition ${isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : ""}`}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
