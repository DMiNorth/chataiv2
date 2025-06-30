"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, CheckSquare, Calendar, User, Flag, Edit, Trash2 } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  dueDate: string
  completed: boolean
}

export default function TasksTool() {
  const { actualTheme } = useTheme()
  const { showSuccess, showError, showLoading, hideNotification } = useNotifications()
  const isDark = actualTheme === "dark"

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Создать контент-план",
      description: "Разработать план контента на следующий месяц",
      status: "В работе",
      priority: "Высокий",
      assignee: "Анна",
      dueDate: "2024-01-20",
      completed: false,
    },
    {
      id: "2",
      title: "Настроить рекламу",
      description: "Запустить рекламную кампанию в социальных сетях",
      status: "Готово",
      priority: "Средний",
      assignee: "Петр",
      dueDate: "2024-01-15",
      completed: true,
    },
    {
      id: "3",
      title: "Анализ конкурентов",
      description: "Провести исследование конкурентов в нише",
      status: "Планируется",
      priority: "Низкий",
      assignee: "Мария",
      dueDate: "2024-01-25",
      completed: false,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Средний",
    assignee: "",
    dueDate: "",
  })

  const handleCreate = async () => {
    if (!newTask.title.trim()) {
      showError("Ошибка создания", "Введите название задачи")
      return
    }

    const loadingId = showLoading("Создание задачи...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: "Планируется",
        priority: newTask.priority,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        completed: false,
      }

      setTasks([task, ...tasks])
      setNewTask({ title: "", description: "", priority: "Средний", assignee: "", dueDate: "" })
      setIsCreating(false)

      hideNotification(loadingId)
      showSuccess("Задача создана", `"${task.title}" добавлена в список`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка создания", "Не удалось создать задачу")
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleSaveEdit = async () => {
    if (!editingTask) return

    const loadingId = showLoading("Сохранение изменений...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)))
      setEditingTask(null)

      hideNotification(loadingId)
      showSuccess("Задача обновлена", "Изменения успешно сохранены")
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка сохранения", "Не удалось сохранить изменения")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) return

    const loadingId = showLoading("Удаление задачи...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const deletedTask = tasks.find((t) => t.id === id)
      setTasks(tasks.filter((t) => t.id !== id))

      hideNotification(loadingId)
      showSuccess("Задача удалена", `"${deletedTask?.title}" удалена`)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка удаления", "Не удалось удалить задачу")
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const loadingId = showLoading(task.completed ? "Возобновление задачи..." : "Завершение задачи...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 400))

      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? "Готово" : "В работе",
              }
            : task,
        ),
      )

      hideNotification(loadingId)
      showSuccess(
        task.completed ? "Задача возобновлена" : "Задача выполнена",
        `"${task.title}" ${task.completed ? "возобновлена" : "отмечена как выполненная"}`,
      )
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка", "Не удалось изменить статус задачи")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Высокий":
        return "bg-red-100 text-red-600 border-red-200"
      case "Средний":
        return "bg-yellow-100 text-yellow-600 border-yellow-200"
      case "Низкий":
        return "bg-green-100 text-green-600 border-green-200"
      default:
        return isDark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Готово":
        return "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20"
      case "В работе":
        return "bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20"
      case "Планируется":
        return isDark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return isDark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          ✅ Управление задачами
        </h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-[#FF9500] to-[#0088CC] hover:from-[#E6850E] hover:to-[#0077B3]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новая задача
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
              Новая задача
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название задачи"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <Input
              placeholder="Описание задачи"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className={`theme-transition ${
                isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
              }`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className={`p-2 border rounded-lg theme-transition ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                }`}
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Низкий">Низкий приоритет</option>
                <option value="Средний">Средний приоритет</option>
                <option value="Высокий">Высокий приоритет</option>
              </select>
              <Input
                placeholder="Исполнитель"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className={`theme-transition ${
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
                }`}
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
            </div>
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
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 theme-transition ${
              isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTask(task.id)}
                  className={`rounded-full w-8 h-8 p-0 ${
                    task.completed
                      ? "bg-[#34C759] text-white hover:bg-[#2FB344]"
                      : "border-2 border-gray-300 hover:border-[#34C759]"
                  }`}
                >
                  {task.completed && <CheckSquare className="w-4 h-4" />}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-semibold ${task.completed ? "line-through opacity-60" : ""} theme-transition ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(task)}
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        className="rounded-full w-8 h-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Badge className={getPriorityColor(task.priority)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>

                  {task.description && (
                    <p
                      className={`text-sm mb-3 ${task.completed ? "line-through opacity-60" : ""} theme-transition ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  <div
                    className={`flex items-center space-x-4 text-sm theme-transition ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {task.assignee && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {task.assignee}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString("ru-RU")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className={`max-w-2xl theme-transition ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
          <DialogHeader>
            <DialogTitle className={`theme-transition ${isDark ? "text-white" : ""}`}>Редактировать задачу</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <Input
                placeholder="Название задачи"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
              <Input
                placeholder="Описание задачи"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className={`p-2 border rounded-lg theme-transition ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                  }`}
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                >
                  <option value="Низкий">Низкий приоритет</option>
                  <option value="Средний">Средний приоритет</option>
                  <option value="Высокий">Высокий приоритет</option>
                </select>
                <select
                  className={`p-2 border rounded-lg theme-transition ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                  }`}
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                >
                  <option value="Планируется">Планируется</option>
                  <option value="В работе">В работе</option>
                  <option value="Готово">Готово</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Исполнитель"
                  value={editingTask.assignee}
                  onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                  className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
                <Input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className={`theme-transition ${isDark ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit}>Сохранить</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                  className={`theme-transition ${isDark ? "border-gray-600 hover:bg-gray-700 text-gray-300" : ""}`}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
