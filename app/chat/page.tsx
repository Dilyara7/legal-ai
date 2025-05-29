"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import {
  Send,
  Plus,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Search,
  Clock,
  Scale,
  Home,
  Briefcase,
  Car,
  FileText,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CreditCard,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { sendMessage, getDialogs, getDialogMessages, deleteDialog } from "@/lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

// Add this import at the top of the file
import { useRouter } from "next/navigation"

// Добавим импорт компонента стоимости запроса
import RequestCost from "@/components/request-cost"
import { getUserBalance, deductFeeFromBalance } from "@/lib/payment-api"

// Категории юридических вопросов
const categories = [
  { id: "family", name: "Семейное право", icon: <Home size={16} /> },
  { id: "labor", name: "Трудовое право", icon: <Briefcase size={16} /> },
  { id: "property", name: "Недвижимость", icon: <Home size={16} /> },
  { id: "consumer", name: "Защита потребителей", icon: <Scale size={16} /> },
  { id: "auto", name: "Автоправо", icon: <Car size={16} /> },
  { id: "documents", name: "Документы", icon: <FileText size={16} /> },
]

// Примеры быстрых вопросов
const quickQuestions = [
  "Как расторгнуть трудовой договор?",
  "Какие документы нужны для оформления наследства?",
  "Что делать, если продавец не возвращает деньги за бракованный товар?",
  "Как оспорить штраф ГИБДД?",
]

// Типы для API данных
interface Dialog {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  file?: string | null
  created_at: string
}

interface DialogWithMessages {
  dialog_id: string
  dialog_name: string
  messages: Message[]
}

export default function ChatPage() {
  const { t } = useLanguage()
  const { toast } = useToast()

  // Add router inside the ChatPage component
  const router = useRouter()

  // Состояния для UI
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null)

  // Состояния для данных
  const [dialogs, setDialogs] = useState<Dialog[]>([])
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [dialogName, setDialogName] = useState<string>("")

  // Состояния для загрузки
  const [loadingDialogs, setLoadingDialogs] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // В компоненте ChatPage добавим состояние для баланса
  const [userBalance, setUserBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загрузка списка диалогов при монтировании
  useEffect(() => {
    fetchDialogs()
  }, [])

  // Добавим функцию для загрузки баланса
  const fetchUserBalance = async () => {
    setIsLoadingBalance(true)
    try {
      const balance = await getUserBalance()
      setUserBalance(balance)
    } catch (error) {
      console.error("Error fetching user balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Вызовем функцию при монтировании компонента
  useEffect(() => {
    fetchUserBalance()
  }, [])

  // Загрузка сообщений при изменении активного диалога
  useEffect(() => {
    if (activeDialogId) {
      fetchDialogMessages(activeDialogId)
    } else {
      // Если нет активного диалога, показываем пустой чат
      setMessages([])
      setDialogName("")
    }
  }, [activeDialogId])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Автоматическое изменение высоты текстового поля
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Update the fetchDialogs function to handle auth errors
  const fetchDialogs = async () => {
    setLoadingDialogs(true)
    setError(null)

    try {
      const data = await getDialogs()
      setDialogs(data)

      // If there are dialogs, select the first one
      if (data.length > 0 && !activeDialogId) {
        setActiveDialogId(data[0].id)
      }
    } catch (err: any) {
      console.error("Error fetching dialogs:", err)

      // Check if it's an authentication error
      if (
        err.message &&
        (err.message.includes("авторизован") ||
          err.message.includes("войдите в систему") ||
          err.message.includes("401"))
      ) {
        setError("Требуется авторизация. Перенаправление на страницу входа...")

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Не удалось загрузить список диалогов")
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список диалогов",
        })
      }
    } finally {
      setLoadingDialogs(false)
    }
  }

  // Similarly update fetchDialogMessages to handle auth errors
  const fetchDialogMessages = async (dialogId: string) => {
    setLoadingMessages(true)
    setError(null)

    try {
      const data = await getDialogMessages(dialogId)
      setMessages(data.messages)
      setDialogName(data.dialog_name)
    } catch (err: any) {
      console.error("Error fetching dialog messages:", err)

      // Check if it's an authentication error
      if (
        err.message &&
        (err.message.includes("авторизован") ||
          err.message.includes("войдите в систему") ||
          err.message.includes("401"))
      ) {
        setError("Требуется авторизация. Перенаправление на страницу входа...")

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Не удалось загрузить сообщения")
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить сообщения диалога",
        })
      }
    } finally {
      setLoadingMessages(false)
    }
  }

  // Обновим функцию handleSend, чтобы проверять баланс перед отправкой
const handleSend = async () => {
  // 0. Не шлём, если нет текста и нет файла или уже идёт отправка
  if ((!input.trim() && !selectedFile) || sendingMessage) return;

  const messageContent = input.trim();
  const tempId = `temp-${Date.now()}`;

  try {
    // 1. Пытаемся списать комиссию, если баланс уже загружен
    if (userBalance !== null) {
      try {
        const newBalance = await deductFeeFromBalance();
        setUserBalance(newBalance);
      } catch (feeError) {
        // 1.1. Если нехватка средств — показываем тост и выходим
        if (
          feeError instanceof Error &&
          /Недостаточно средств/i.test(feeError.message)
        ) {
          toast({
            variant: "destructive",
            title: "Недостаточно средств",
            description: "Для отправки сообщения необходимо пополнить баланс",
          });
          return;
        }
        // 1.2. Для остальных ошибок — логируем, но разрешаем отправку
        console.warn(
          "Ошибка списания комиссии, продолжаем отправку:",
          feeError
        );
      }
    }

    // 2. Вставляем временное сообщение пользователя в UI
    const userMessage: Message = {
      id: tempId,
      role: "user",
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setSendingMessage(true);

    // 3. Отправляем на сервер
    const response = await sendMessage(
      activeDialogId,
      messageContent,
      selectedFile || undefined
    );

    // 4. Если создался новый диалог — обновляем список и выбираем его
    if (!activeDialogId || activeDialogId !== response.dialog_id) {
      setActiveDialogId(response.dialog_id);
      fetchDialogs();
    }

    // 5. Собираем реальные объекты сообщений из ответа
    const realUserMsg: Message = {
      id: response.user_message.id,
      role: "user",
      content: response.user_message.content,
      file: response.user_message.file,
      created_at:
        response.user_message.created_at || new Date().toISOString(),
    };
    const assistantMsg: Message = {
      id: response.assistant_message.id,
      role: "assistant",
      content: response.assistant_message.content,
      created_at: new Date().toISOString(),
    };

    // 6. Заменяем временное сообщение и добавляем ответ ассистента
    setMessages((prev) =>
      prev
        .map((msg) => (msg.id === tempId ? realUserMsg : msg))
        .concat(assistantMsg)
    );

    // 7. Обновляем имя диалога, если оно изменилось
    if (dialogName !== response.dialog_name) {
      setDialogName(response.dialog_name);
    }
  } catch (err: any) {
    console.error("Error sending message:", err);

    const errMsg = err.message || "";
    // 8. Ошибка авторизации — показываем тост и редиректим
    if (/авторизован|401|войдите в систему/i.test(errMsg)) {
      toast({
        variant: "destructive",
        title: "Ошибка авторизации",
        description: "Требуется авторизация. Перенаправление на страницу входа...",
      });
      setTimeout(() => router.push("/login"), 2000);
    } else {
      // 9. Любая другая ошибка отправки — общий тост
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
      });
    }
    // 10. Убираем временное сообщение из UI
    setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
  } finally {
    // 11. Всегда выключаем индикатор отправки
    setSendingMessage(false);
  }
};

  // Функция для удаления диалога с подтверждением  

  // Функция для удаления диалога
  const handleDeleteDialog = async () => {
    if (!deleteDialogId) return

    try {
      await deleteDialog(deleteDialogId)

      // Обновляем список диалогов
      setDialogs((prev) => prev.filter((dialog) => dialog.id !== deleteDialogId))

      // Если удаляем активный диалог, сбрасываем его
      if (deleteDialogId === activeDialogId) {
        setActiveDialogId(null)
        setMessages([])
        setDialogName("")
      }

      toast({
        title: "Диалог удален",
        description: "Диалог был успешно удален",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить диалог",
      })
    } finally {
      setDeleteDialogId(null)
    }
  }

  // Функция для создания нового диалога
  const startNewDialog = () => {
    setActiveDialogId(null)
    setMessages([])
    setDialogName("")
  }

  // Функция для выбора быстрого вопроса
  const handleQuickQuestion = (question: string) => {
    setInput(question)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Функция для обработки загрузки файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      toast({
        title: "Файл выбран",
        description: `Файл "${e.target.files[0].name}" будет отправлен с сообщением`,
      })
    }
  }

  // Функция для открытия диалога выбора файла
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Функция для форматирования времени
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  // Функция для форматирования текста сообщения
  const formatMessageText = (text: string) => {
    // Обработка жирного текста (**текст**)
    const boldProcessed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Обработка переносов строк (\n\n)
    const formattedText = boldProcessed.split("\n\n").map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mt-2" : ""}>
        {paragraph.split("\n").map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.replace(/\*\*(.*?)\*\*/g, (match, content) => `<strong>${content}</strong>`)}
            {lineIndex < paragraph.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ))

    return <div dangerouslySetInnerHTML={{ __html: boldProcessed.replace(/\n\n/g, "<br><br>") }} />
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Боковая панель с чатами */}
      <aside
        className={`bg-gray-800 text-white overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-72" : "w-0"}`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
              <Button onClick={startNewDialog} className="w-full mb-4" variant="secondary">
                <Plus size={16} className="mr-2" /> Новый чат
              </Button>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Поиск чатов..." className="pl-8 bg-gray-700 border-gray-600 text-white" />
              </div>
            </div>

            <Tabs defaultValue="chats" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 mx-4 mt-2">
                <TabsTrigger value="chats">Чаты</TabsTrigger>
                <TabsTrigger value="categories">Категории</TabsTrigger>
              </TabsList>

              <TabsContent value="chats" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {loadingDialogs ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : dialogs.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">Нет доступных диалогов</div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {dialogs.map((dialog) => (
                        <div key={dialog.id} className="flex items-center">
                          <Button
                            variant={activeDialogId === dialog.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left"
                            onClick={() => setActiveDialogId(dialog.id)}
                          >
                            <div className="flex items-start mr-2">
                              <Bot size={16} className="mt-0.5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="truncate font-medium">{dialog.name}</div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>{formatDate(dialog.updated_at)}</span>
                              </div>
                            </div>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-500" onClick={() => setDeleteDialogId(dialog.id)}>
                                <Trash2 size={16} className="mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="categories" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          startNewDialog()
                          setInput(`Консультация по теме: ${category.name}`)
                        }}
                      >
                        <div className="mr-2">{category.icon}</div>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </aside>

      {/* Основная область чата */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Заголовок чата */}
        <header className="bg-white border-b p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-2">
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </Button>

            <div>
              <h2 className="font-medium">{activeDialogId ? dialogName : "Новый чат"}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Clock size={18} />
            </Button>
            {activeDialogId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-red-500" onClick={() => setDeleteDialogId(activeDialogId)}>
                    <Trash2 size={16} className="mr-2" />
                    Удалить диалог
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Область сообщений */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Индикатор загрузки сообщений */}
            {loadingMessages && (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            {/* Ошибка загрузки */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Быстрые вопросы в начале чата */}
            {!activeDialogId && messages.length === 0 && !loadingMessages && (
              <>
                <div className="text-center mb-6">
                  <Bot size={48} className="mx-auto mb-2 text-gray-400" />
                  <h3 className="text-xl font-medium">Юридический ассистент</h3>
                  <p className="text-gray-500 mt-1">Задайте вопрос, чтобы начать консультацию</p>
                </div>
                <Card className="p-4 mb-6">
                  <h3 className="font-medium mb-2">Популярные вопросы:</h3>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Сообщения */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className={`h-8 w-8 ${msg.role === "user" ? "ml-2" : "mr-2"}`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </Avatar>

                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {formatMessageText(msg.content)}
                      {msg.file && (
                        <div className="mt-2">
                          <a
                            href={msg.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm underline"
                          >
                            <Paperclip size={14} className="mr-1" />
                            Прикрепленный файл
                          </a>
                        </div>
                      )}
                    </div>

                    <div className={`flex text-xs text-gray-500 mt-1 ${msg.role === "user" ? "justify-end" : ""}`}>
                      <span>{formatTime(msg.created_at)}</span>
                    </div>

                    {msg.role === "assistant" && (
                      <div className="flex mt-1 space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Индикатор отправки сообщения */}
            {sendingMessage && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <Bot size={16} />
                  </Avatar>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-tl-none">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Выбранный файл */}
            {selectedFile && (
              <div className="bg-blue-50 p-2 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Paperclip size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="h-6 w-6 p-0">
                  <X size={14} />
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Область ввода */}
        <footer className="bg-white border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !sendingMessage) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={sendingMessage ? "Отправка сообщения..." : "Введите ваш вопрос..."}
                  className={`min-h-[40px] resize-none pr-10 ${sendingMessage ? "bg-gray-100" : ""}`}
                  rows={1}
                  disabled={sendingMessage}
                />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-1.5 text-gray-500"
                  onClick={handleFileButtonClick}
                  disabled={sendingMessage}
                >
                  <Paperclip size={18} />
                </Button>
              </div>
              <Button onClick={handleSend} disabled={(!input.trim() && !selectedFile) || sendingMessage}>
                {sendingMessage ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <div>
                {sendingMessage
                  ? "Пожалуйста, подождите..."
                  : "Нажмите Enter для отправки, Shift+Enter для переноса строки"}
              </div>
              <div className="flex items-center space-x-4">
                <RequestCost messageLength={input.length} />
                {userBalance !== null && (
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Баланс: {userBalance.toFixed(2)} тг
                    <Button variant="link" size="sm" className="text-xs p-0 h-auto ml-1" asChild>
                      <Link href="/profile/balance">Пополнить</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={!!deleteDialogId} onOpenChange={() => setDeleteDialogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить диалог?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить. Диалог будет удален навсегда.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDialog} className="bg-red-500 hover:bg-red-600">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
