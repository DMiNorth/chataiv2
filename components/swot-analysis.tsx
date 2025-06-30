"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/hooks/use-theme"

export default function SwotAnalysis() {
  const { actualTheme } = useTheme()
  const isDark = actualTheme === "dark"

  const swotData = {
    strengths: ["Опытная команда", "Уникальный продукт", "Сильный бренд"],
    weaknesses: ["Ограниченный бюджет", "Малая команда", "Новый рынок"],
    opportunities: ["Рост рынка", "Новые технологии", "Партнерства"],
    threats: ["Конкуренты", "Экономический кризис", "Изменения в законах"],
  }

  const sections = [
    {
      title: "Сильные стороны",
      data: swotData.strengths,
      color: isDark ? "bg-[#34C759]/20 border-[#34C759]/40" : "bg-[#34C759]/10 border-[#34C759]/20",
    },
    {
      title: "Слабые стороны",
      data: swotData.weaknesses,
      color: isDark ? "bg-[#FF9500]/20 border-[#FF9500]/40" : "bg-[#FF9500]/10 border-[#FF9500]/20",
    },
    {
      title: "Возможности",
      data: swotData.opportunities,
      color: isDark ? "bg-[#0088CC]/20 border-[#0088CC]/40" : "bg-[#0088CC]/10 border-[#0088CC]/20",
    },
    {
      title: "Угрозы",
      data: swotData.threats,
      color: isDark ? "bg-red-500/20 border-red-500/40" : "bg-red-50 border-red-200",
    },
  ]

  return (
    <Card
      className={`border-0 shadow-sm theme-transition ${
        isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
      }`}
    >
      <CardHeader>
        <CardTitle className={`text-lg theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
          SWOT Анализ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <div key={index} className={`p-4 rounded-lg border ${section.color}`}>
              <h4 className={`font-semibold mb-3 theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.data.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={`text-sm flex items-center theme-transition ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${isDark ? "bg-gray-400" : "bg-gray-400"}`}
                    ></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
