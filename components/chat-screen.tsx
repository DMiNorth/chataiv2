"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Mic, Paperclip, Smile, MoreVertical, File, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/components/notification-system"
import SubscriptionBadge from "@/components/subscription-badge"
import SubscriptionModal from "@/components/subscription-modal"
import ChatMenu from "@/components/chat-menu"
import { Skeleton } from "@/components/skeleton"
import { useSubscription } from "@/hooks/use-subscription"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  avatar?: string
  file?: {
    name: string
    type: string
    size: number
    url?: string
  }
}

export default function ChatScreen() {
  const { actualTheme } = useTheme()
  const { showSuccess, showError, showLoading, hideNotification } = useNotifications()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDark = actualTheme === "dark"
  const subscription = useSubscription()

  // Симуляция загрузки сообщений
  useEffect(() => {
    const loadMessages = async () => {
      // Симуляция загрузки
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessages([
        {
          id: "1",
          text: "Привет! Я ваш AI-помощник. Чем могу помочь? 😊",
          isUser: false,
          timestamp: new Date(Date.now() - 60000),
          avatar: "🤖",
        },
        {
          id: "2",
          text: "Привет! Можешь помочь мне с планированием проекта?",
          isUser: true,
          timestamp: new Date(Date.now() - 30000),
        },
        {
          id: "3",
          text: "Конечно! Расскажите подробнее о вашем проекте. Какие у вас цели и временные рамки?",
          isUser: false,
          timestamp: new Date(),
          avatar: "🤖",
        },
      ])

      setIsLoadingMessages(false)
    }

    loadMessages()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      showSuccess("Файл выбран", `${file.name} готов к отправке`)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const sendMessage = async () => {
    if (subscription?.isExpired) {
      showError("Доступ ограничен", "Для отправки сообщений необходимо продлить подписку")
      return
    }

    if (!inputText.trim() && !selectedFile) return

    const loadingId = showLoading("Отправка сообщения...")

    try {
      // Симуляция отправки
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText || (selectedFile ? `Отправил файл: ${selectedFile.name}` : ""),
        isUser: true,
        timestamp: new Date(),
        file: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
              url: URL.createObjectURL(selectedFile),
            }
          : undefined,
      }

      setMessages((prev) => [...prev, newMessage])
      setInputText("")
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      hideNotification(loadingId)
      showSuccess("Сообщение отправлено")

      setIsTyping(true)

      // Симуляция ответа AI
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: selectedFile
            ? `Получил ваш файл "${selectedFile.name}". Анализирую содержимое...`
            : "Отличный вопрос! Давайте разберем это пошагово. Я помогу вам создать детальный план.",
          isUser: false,
          timestamp: new Date(),
          avatar: "🤖",
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    } catch (error) {
      hideNotification(loadingId)
      showError("Ошибка отправки", "Не удалось отправить сообщение")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    return File
  }

  const handleUpgrade = () => {
    setIsSubscriptionModalOpen(true)
  }

  const MessageSkeleton = () => (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-end space-x-2 max-w-[85%]">
        <Skeleton variant="circular" width={32} height={32} />
        <div
          className={`p-4 rounded-2xl rounded-bl-lg border theme-transition ${
            isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
          }`}
        >
          <Skeleton variant="text" lines={2} />
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`flex flex-col h-screen theme-transition ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-[#F0F2F5] to-white"}`}
    >
      {/* Header */}
      <div
        className={`backdrop-blur-md border-b shadow-sm theme-transition ${isDark ? "bg-gray-800/95 border-gray-700/50" : "bg-white/95 border-gray-200/50"}`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0088CC] to-[#34C759] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">🤖</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#34C759] rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className={`text-lg font-semibold theme-transition ${isDark ? "text-white" : "text-gray-900"}`}>
                AI Помощник
              </h1>
              <p className="text-sm text-[#34C759] flex items-center">
                <span className="w-2 h-2 bg-[#34C759] rounded-full mr-2 animate-pulse"></span>
                онлайн
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SubscriptionBadge variant="compact" onUpgrade={handleUpgrade} />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => setIsMenuOpen(true)}
            >
              <MoreVertical className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {isLoadingMessages ? (
          <>
            <MessageSkeleton />
            <div className="flex justify-end">
              <div
                className={`p-4 rounded-2xl rounded-br-lg max-w-[85%] ${
                  isDark ? "bg-gray-700" : "bg-white border border-gray-100"
                }`}
              >
                <Skeleton variant="text" lines={1} />
              </div>
            </div>
            <MessageSkeleton />
          </>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`flex items-end space-x-2 max-w-[85%] ${message.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* Avatar */}
                {!message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0088CC] to-[#34C759] rounded-full flex items-center justify-center text-sm mb-1 shadow-md">
                    {message.avatar}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md max-w-[280px] sm:max-w-[320px] break-words ${
                    message.isUser
                      ? "bg-[#0088CC] text-white rounded-2xl rounded-br-lg"
                      : isDark
                        ? "bg-gray-700 text-gray-100 border border-gray-600 rounded-2xl rounded-bl-lg"
                        : "bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-lg"
                  }`}
                >
                  {/* File attachment */}
                  {message.file && (
                    <div
                      className={`mb-3 p-3 rounded-lg theme-transition ${
                        message.isUser ? "bg-white/20" : isDark ? "bg-gray-600" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {React.createElement(getFileIcon(message.file.type), {
                          className: `w-8 h-8 ${
                            message.isUser ? "text-white" : isDark ? "text-gray-300" : "text-gray-600"
                          }`,
                        })}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              message.isUser ? "text-white" : isDark ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {message.file.name}
                          </p>
                          <p
                            className={`text-xs ${
                              message.isUser ? "text-white/70" : isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatFileSize(message.file.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>

                  {/* Timestamp */}
                  <div
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-blue-100" : isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* User Avatar */}
                {message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF9500] to-[#34C759] rounded-full flex items-center justify-center text-sm mb-1 shadow-md">
                    👤
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-end space-x-2 max-w-[85%]">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0088CC] to-[#34C759] rounded-full flex items-center justify-center text-sm mb-1 shadow-md">
                🤖
              </div>
              <div
                className={`px-4 py-3 rounded-2xl rounded-bl-lg border shadow-sm theme-transition ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
                }`}
              >
                <div className="flex space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-gray-400" : "bg-gray-400"}`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-gray-400" : "bg-gray-400"}`}
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-gray-400" : "bg-gray-400"}`}
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={`fixed bottom-20 left-0 right-0 backdrop-blur-md border-t theme-transition ${
          isDark ? "bg-gray-800/95 border-gray-700/50" : "bg-white/95 border-gray-200/50"
        }`}
      >
        <div className="p-4">
          {/* Selected file preview */}
          {selectedFile && (
            <div
              className={`mb-3 p-3 rounded-xl border theme-transition ${
                isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {React.createElement(getFileIcon(selectedFile.type), {
                    className: `w-6 h-6 ${isDark ? "text-gray-300" : "text-gray-600"}`,
                  })}
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {selectedFile.name}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeSelectedFile} className="rounded-full w-8 h-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="*/*" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-full w-10 h-10 p-0 theme-transition ${
                isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            {/* Input Container */}
            <div className="flex-1 relative">
              <div
                className={`rounded-3xl border shadow-sm focus-within:shadow-md transition-all duration-300 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 focus-within:border-[#0088CC]"
                    : "bg-white border-gray-200 focus-within:border-[#0088CC]"
                }`}
              >
                <div className="flex items-end pr-12">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={subscription?.isExpired ? "Подписка истекла..." : "Напишите сообщение..."}
                    className={`border-0 bg-transparent rounded-3xl px-4 py-3 resize-none focus:ring-0 focus:outline-none w-full min-h-[44px] max-h-32 theme-transition ${
                      isDark ? "text-gray-100 placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    disabled={subscription?.isExpired}
                    rows={1}
                    style={{
                      overflow: "hidden",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = "auto"
                      target.style.height = Math.min(target.scrollHeight, 128) + "px"
                    }}
                  />
                </div>

                {/* Emoji Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 theme-transition ${
                    isDark ? "text-gray-300 hover:bg-gray-600" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Send/Voice Button */}
            {inputText.trim() || selectedFile ? (
              <Button
                onClick={sendMessage}
                disabled={subscription?.isExpired}
                className={`rounded-full w-12 h-12 p-0 bg-[#0088CC] hover:bg-[#0077B3] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  subscription?.isExpired ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                disabled={subscription?.isExpired}
                className={`rounded-full w-12 h-12 p-0 bg-[#34C759] hover:bg-[#2FB344] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  subscription?.isExpired ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Mic className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <ChatMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
    </div>
  )
}
