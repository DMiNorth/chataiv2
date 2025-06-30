"use client"

import { useState, useEffect } from "react"

interface Subscription {
  name: string
  expiryDate: string
  isActive: boolean
  isExpired: boolean
  isExpiringSoon: boolean
  daysLeft: number
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    // Мокаем данные подписки с актуальной датой
    const mockSubscription = {
      name: "Продвинутая",
      expiryDate: "2025-08-15", // Активная дата в будущем (через ~50 дней от 26.06.2025)
    }

    const daysLeft = Math.ceil(
      (new Date(mockSubscription.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )

    const isExpired = daysLeft < 0
    const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0
    const isActive = daysLeft > 0

    setSubscription({
      name: mockSubscription.name,
      expiryDate: mockSubscription.expiryDate,
      isActive,
      isExpired,
      isExpiringSoon,
      daysLeft,
    })
  }, [])

  return subscription
}
