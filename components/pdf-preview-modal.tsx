"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  isGenerating: boolean
}

export default function PDFPreviewModal({ isOpen, onClose, onDownload, isGenerating }: PDFPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Предпросмотр PDF отчета
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Content */}
          <div className="bg-gray-50 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0088CC] to-[#34C759] text-white p-6 rounded-lg mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">📊 Аналитический отчет</h1>
                <p className="opacity-90">Детальный анализ деятельности и рекомендации</p>
              </div>

              {/* Profile Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0088CC] to-[#34C759] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">АИ</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Александр Иванов</h2>
                <p className="text-gray-600 mb-4">Предприниматель</p>
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0088CC]">156</div>
                    <div className="text-sm text-gray-600">Проектов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#34C759]">89%</div>
                    <div className="text-sm text-gray-600">Успешность</div>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-[#0088CC] pb-2">
                  📈 Ключевые показатели
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "📈", label: "Рост", value: "+24%" },
                    { icon: "👥", label: "Клиенты", value: "1,234" },
                    { icon: "💰", label: "Доход", value: "₽125K" },
                    { icon: "🎯", label: "Цели", value: "8/10" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SWOT Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-[#0088CC] pb-2">
                  🎯 SWOT Анализ
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-bold text-green-800 mb-2">💪 Сильные стороны</div>
                    <ul className="text-green-700 space-y-1">
                      <li>• Опытная команда</li>
                      <li>• Уникальный продукт</li>
                      <li>• Сильный бренд</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                    <div className="font-bold text-yellow-800 mb-2">⚠️ Слабые стороны</div>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Ограниченный бюджет</li>
                      <li>• Малая команда</li>
                      <li>• Новый рынок</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <div className="font-bold text-blue-800 mb-2">🚀 Возможности</div>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Рост рынка</li>
                      <li>• Новые технологии</li>
                      <li>• Партнерства</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <div className="font-bold text-red-800 mb-2">⚡ Угрозы</div>
                    <ul className="text-red-700 space-y-1">
                      <li>• Конкуренты</li>
                      <li>• Экономический кризис</li>
                      <li>• Изменения в законах</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800 text-white p-4 rounded-lg text-center">
                <p className="font-bold">🤖 Telegram AI Assistant</p>
                <p className="text-sm opacity-80">Отчет создан: {new Date().toLocaleDateString("ru-RU")}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={onDownload}
              disabled={isGenerating}
              className="bg-gradient-to-r from-[#0088CC] to-[#34C759] hover:from-[#0077B3] hover:to-[#2FB344]"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Создание PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
