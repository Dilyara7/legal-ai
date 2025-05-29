"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { sendMessage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function SupportChat() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t.supportChat.greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dialogId, setDialogId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const router = useRouter()

  // Update the handleSend function to handle auth errors
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message to chat immediately
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API - for first message don't send dialogId
      const response = await sendMessage(dialogId, input)

      // Save dialog ID for subsequent messages
      if (!dialogId && response.dialog_id) {
        setDialogId(response.dialog_id)
      }

      // Add bot response to chat after receiving API response
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.assistant_message.content,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error: any) {
      console.error("Error sending message:", error)

      // Check if it's an authentication error
      if (
        error.message &&
        (error.message.includes("авторизован") ||
          error.message.includes("войдите в систему") ||
          error.message.includes("401"))
      ) {
        toast({
          variant: "destructive",
          title: "Ошибка авторизации",
          description: "Требуется авторизация. Перенаправление на страницу входа...",
        })

        // Add auth error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            text: "Требуется авторизация. Пожалуйста, войдите в систему.",
            sender: "bot",
            timestamp: new Date(),
          },
        ])

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
        })

        // Add general error message
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            text: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Format time for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format message text with bold and line breaks
  const formatMessageText = (text: string) => {
    // Process bold text (**text**)
    const boldProcessed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Process line breaks (\n\n)
    const withLineBreaks = boldProcessed.replace(/\n\n/g, "<br><br>")

    return <span dangerouslySetInnerHTML={{ __html: withLineBreaks }} />
  }

  return (
    <>
      {/* Плавающая кнопка чата */}
      <Button
        className="fixed right-6 bottom-6 rounded-full w-14 h-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Окно чата */}
      <div
        className={cn(
          "fixed right-6 bottom-6 w-80 bg-white rounded-lg shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "h-96 opacity-100" : "h-0 opacity-0 pointer-events-none",
        )}
      >
        {/* Заголовок чата */}
        <div className="bg-gray-900 text-white p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium">{t.supportChat.title}</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white">
            <X size={18} />
          </Button>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <div>{formatMessageText(msg.text)}</div>
                <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-3 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder={isLoading ? t.supportChat.waitingResponse : t.supportChat.inputPlaceholder}
              className={`flex-1 ${isLoading ? "bg-gray-100" : ""}`}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
