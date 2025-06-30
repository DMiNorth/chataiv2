"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"
import { Settings, Moon, Sun, Monitor, Bell, Archive, Search, HelpCircle, LogOut } from "lucide-react"

interface ChatMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatMenu({ isOpen, onClose }: ChatMenuProps) {
  const { theme, setTheme, actualTheme } = useTheme()
  const { showSuccess, showInfo } = useNotifications()

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    showSuccess(
      "Тема изменена",
      `Установлена ${newTheme === "light" ? "светлая" : newTheme === "dark" ? "темная" : "системная"} тема`,
    )
  }

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "notifications":
        showInfo("Уведомления", "Настройки уведомлений")
        break
      case "archive":
        showInfo("Архив", "Архивированные чаты")
        break
      case "search":
        showInfo("Поиск", "Поиск по сообщениям")
        break
      case "help":
        showInfo("Помощь", "Справочная информация")
        break
      case "logout":
        showInfo("Выход", "Выход из аккаунта")
        break
    }
    onClose()
  }

  const menuItems = [
    { icon: Bell, label: "Уведомления", action: "notifications" },
    { icon: Archive, label: "Архив", action: "archive" },
    { icon: Search, label: "Поиск", action: "search" },
    { icon: HelpCircle, label: "Помощь", action: "help" },
    { icon: LogOut, label: "Выход", action: "logout", danger: true },
  ]

  const themeOptions = [
    { value: "light", label: "Светлая", icon: Sun },
    { value: "dark", label: "Темная", icon: Moon },
    { value: "system", label: "Системная", icon: Monitor },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-sm theme-transition ${actualTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Настройки чата
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Тема оформления</h3>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const isActive = theme === option.value
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange(option.value as any)}
                    className={`flex flex-col items-center p-3 h-auto ${
                      isActive
                        ? "bg-[#0088CC] text-white"
                        : actualTheme === "dark"
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Menu Items */}
          <div>
            <h3 className="text-sm font-medium mb-3">Действия</h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.action}
                    variant="ghost"
                    onClick={() => handleMenuAction(item.action)}
                    className={`w-full justify-start ${
                      item.danger
                        ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                        : actualTheme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
