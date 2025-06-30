// Улучшенная библиотека для генерации PDF без печати
interface AnalyticsData {
  profile: {
    name: string
    position: string
    projects: number
    successRate: number
  }
  stats: Array<{
    label: string
    value: string
    icon: string
  }>
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  chartData: {
    growth: Array<{ month: string; value: number }>
    distribution: Array<{ label: string; value: number }>
  }
}

export async function generateAnalyticsPDF(data: AnalyticsData) {
  try {
    // Создаем HTML контент для PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Аналитический отчет</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            background: white;
            font-size: 12px;
          }
          
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          
          .header {
            background: linear-gradient(135deg, #0088CC 0%, #34C759 100%);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: bold;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .profile-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
            border: 1px solid #e9ecef;
          }
          
          .profile-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #2c3e50;
          }
          
          .profile-position {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 15px;
          }
          
          .profile-stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
          }
          
          .stat-item {
            text-align: center;
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #0088CC;
          }
          
          .stat-label {
            color: #7f8c8d;
            font-size: 12px;
          }
          
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2c3e50;
            border-bottom: 2px solid #0088CC;
            padding-bottom: 5px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .stat-card {
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
          }
          
          .stat-icon {
            font-size: 20px;
            margin-bottom: 8px;
          }
          
          .stat-card-value {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 4px;
          }
          
          .stat-card-label {
            color: #7f8c8d;
            font-size: 11px;
          }
          
          .swot-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 15px;
          }
          
          .swot-item {
            border-radius: 8px;
            padding: 15px;
            page-break-inside: avoid;
          }
          
          .swot-strengths {
            background: #d4edda;
            border-left: 4px solid #28a745;
          }
          
          .swot-weaknesses {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
          }
          
          .swot-opportunities {
            background: #cce5ff;
            border-left: 4px solid #007bff;
          }
          
          .swot-threats {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
          }
          
          .swot-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 13px;
          }
          
          .swot-list {
            list-style: none;
          }
          
          .swot-list li {
            margin-bottom: 5px;
            padding-left: 12px;
            position: relative;
            font-size: 11px;
          }
          
          .swot-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #0088CC;
          }
          
          .chart-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid #e9ecef;
            page-break-inside: avoid;
          }
          
          .chart-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2c3e50;
            text-align: center;
          }
          
          .chart-data {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 15px;
          }
          
          .chart-item {
            text-align: center;
            background: white;
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .chart-value {
            font-size: 14px;
            font-weight: bold;
            color: #0088CC;
            margin-bottom: 4px;
          }
          
          .chart-label {
            color: #7f8c8d;
            font-size: 10px;
          }
          
          .footer {
            background: #2c3e50;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin-top: 25px;
          }
          
          .footer p {
            margin-bottom: 5px;
            font-size: 12px;
          }
          
          .generated-date {
            opacity: 0.8;
            font-size: 10px;
          }
          
          @media print {
            .header, .section, .chart-section, .footer {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Аналитический отчет</h1>
            <p>Детальный анализ деятельности и рекомендации</p>
          </div>
          
          <div class="profile-section">
            <div class="profile-name">${data.profile.name}</div>
            <div class="profile-position">${data.profile.position}</div>
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-value">${data.profile.projects}</div>
                <div class="stat-label">Проектов</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${data.profile.successRate}%</div>
                <div class="stat-label">Успешность</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">📈 Ключевые показатели</h2>
            <div class="stats-grid">
              ${data.stats
                .map(
                  (stat) => `
                <div class="stat-card">
                  <div class="stat-icon">${stat.icon}</div>
                  <div class="stat-card-value">${stat.value}</div>
                  <div class="stat-card-label">${stat.label}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">🎯 SWOT Анализ</h2>
            <div class="swot-grid">
              <div class="swot-item swot-strengths">
                <div class="swot-title">💪 Сильные стороны</div>
                <ul class="swot-list">
                  ${data.swot.strengths.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
              
              <div class="swot-item swot-weaknesses">
                <div class="swot-title">⚠️ Слабые стороны</div>
                <ul class="swot-list">
                  ${data.swot.weaknesses.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
              
              <div class="swot-item swot-opportunities">
                <div class="swot-title">🚀 Возможности</div>
                <ul class="swot-list">
                  ${data.swot.opportunities.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
              
              <div class="swot-item swot-threats">
                <div class="swot-title">⚡ Угрозы</div>
                <ul class="swot-list">
                  ${data.swot.threats.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="chart-section">
            <div class="chart-title">📊 Динамика роста по месяцам</div>
            <div class="chart-data">
              ${data.chartData.growth
                .map(
                  (item) => `
                <div class="chart-item">
                  <div class="chart-value">${item.value}%</div>
                  <div class="chart-label">${item.month}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          
          <div class="chart-section">
            <div class="chart-title">🎯 Распределение ресурсов</div>
            <div class="chart-data">
              ${data.chartData.distribution
                .map(
                  (item) => `
                <div class="chart-item">
                  <div class="chart-value">${item.value}%</div>
                  <div class="chart-label">${item.label}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          
          <div class="footer">
            <p><strong>🤖 Telegram AI Assistant</strong></p>
            <p>Ваш персональный помощник для бизнес-аналитики</p>
            <p class="generated-date">Отчет создан: ${new Date().toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Создаем Blob и скачиваем как HTML файл (который можно сохранить как PDF)
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.html`
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Ошибка при создании PDF:", error)
    throw new Error("Не удалось создать PDF файл")
  }
}
