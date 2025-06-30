"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { useTheme } from "@/hooks/use-theme"

export default function ChartsSection() {
  const { actualTheme } = useTheme()
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const isDark = actualTheme === "dark"

  // Данные для линейного графика с более понятной информацией
  const lineData = [
    { month: "Янв", value: 65, label: "Продажи: 65%" },
    { month: "Фев", value: 78, label: "Продажи: 78%" },
    { month: "Мар", value: 82, label: "Продажи: 82%" },
    { month: "Апр", value: 75, label: "Продажи: 75%" },
    { month: "Май", value: 90, label: "Продажи: 90%" },
    { month: "Июн", value: 95, label: "Продажи: 95%" },
  ]

  // Данные для кругового графика
  const pieData = [
    { label: "Продажи", value: 45, color: "#0088CC" },
    { label: "Маркетинг", value: 30, color: "#34C759" },
    { label: "Разработка", value: 25, color: "#FF9500" },
  ]

  useEffect(() => {
    const canvas = lineChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Настройки canvas
    const width = (canvas.width = canvas.offsetWidth * 2)
    const height = (canvas.height = canvas.offsetHeight * 2)
    ctx.scale(2, 2)

    const chartWidth = canvas.offsetWidth - 80
    const chartHeight = canvas.offsetHeight - 80
    const startX = 40
    const startY = canvas.offsetHeight - 40

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Находим максимальное и минимальное значения
    const maxValue = Math.max(...lineData.map((d) => d.value))
    const minValue = Math.min(...lineData.map((d) => d.value)) - 10
    const valueRange = maxValue - minValue

    // Цвета для темной/светлой темы
    const gridColor = isDark ? "#374151" : "#e5e7eb"
    const textColor = isDark ? "#9ca3af" : "#6b7280"
    const lineColor = "#0088CC"
    const pointColor = "#34C759"

    // Рисуем сетку
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    // Горизонтальные линии сетки
    for (let i = 0; i <= 5; i++) {
      const y = startY - (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + chartWidth, y)
      ctx.stroke()

      // Подписи по Y
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "right"
      const value = Math.round(minValue + (valueRange / 5) * i)
      ctx.fillText(`${value}%`, startX - 10, y + 4)
    }

    // Вертикальные линии сетки
    lineData.forEach((_, index) => {
      const x = startX + (chartWidth / (lineData.length - 1)) * index
      ctx.strokeStyle = gridColor
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, startY - chartHeight)
      ctx.stroke()
    })

    // Рисуем область под линией (градиент)
    const gradient = ctx.createLinearGradient(0, startY - chartHeight, 0, startY)
    gradient.addColorStop(0, `${lineColor}20`)
    gradient.addColorStop(1, `${lineColor}05`)

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(startX, startY)

    lineData.forEach((point, index) => {
      const x = startX + (chartWidth / (lineData.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = startY - chartHeight * normalizedValue

      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(startX + chartWidth, startY)
    ctx.closePath()
    ctx.fill()

    // Рисуем основную линию
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 3
    ctx.beginPath()

    lineData.forEach((point, index) => {
      const x = startX + (chartWidth / (lineData.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = startY - chartHeight * normalizedValue

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Рисуем точки
    lineData.forEach((point, index) => {
      const x = startX + (chartWidth / (lineData.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = startY - chartHeight * normalizedValue

      // Внешний круг (белый)
      ctx.fillStyle = isDark ? "#1f2937" : "#ffffff"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Внутренний круг (цветной)
      ctx.fillStyle = pointColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Подписи по X
      ctx.fillStyle = textColor
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(point.month, x, startY + 20)

      // Значения над точками
      ctx.fillStyle = isDark ? "#ffffff" : "#1f2937"
      ctx.font = "bold 11px Arial"
      ctx.fillText(`${point.value}%`, x, y - 12)
    })

    // Заголовок графика
    ctx.fillStyle = isDark ? "#ffffff" : "#1f2937"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Динамика продаж по месяцам (%)", canvas.offsetWidth / 2, 20)

    // Легенда
    ctx.fillStyle = textColor
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("📈 Рост продаж", startX, canvas.offsetHeight - 10)
  }, [isDark])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Line Chart */}
      <Card
        className={`backdrop-blur-sm border-0 shadow-lg theme-transition ${
          isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
        }`}
      >
        <CardHeader>
          <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
            📈 Динамика роста
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas ref={lineChartRef} className="w-full h-64 cursor-pointer" style={{ maxWidth: "100%" }} />
          </div>
          <div className={`mt-4 text-sm theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <p>Показатели эффективности продаж за последние 6 месяцев</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#0088CC] rounded-full mr-2"></div>
                <span>Линия тренда</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#34C759] rounded-full mr-2"></div>
                <span>Ключевые точки</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card
        className={`backdrop-blur-sm border-0 shadow-lg theme-transition ${
          isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
        }`}
      >
        <CardHeader>
          <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
            🎯 Распределение ресурсов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Простая имитация кругового графика */}
              <div className="w-full h-full rounded-full border-8 border-[#0088CC] border-r-[#34C759] border-b-[#FF9500] border-l-[#0088CC] transform rotate-45"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-lg font-bold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                    100%
                  </div>
                  <div className={`text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>Всего</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                  <span className={`text-sm theme-transition ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-sm font-medium theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
          <div className={`mt-4 text-xs theme-transition ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Распределение бюджета по направлениям деятельности
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
