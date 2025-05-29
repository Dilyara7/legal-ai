"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Calendar, MessageCircle, FileText, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

// Типы для истории консультаций
interface Consultation {
  id: string
  date: string
  type: "chat" | "voice" | "video"
  duration: number
  cost: number
  status: "completed" | "cancelled" | "in_progress"
  rating?: number
  summary?: string
  specialist?: string
}

// Моковые данные для демонстрации
const mockConsultations: Consultation[] = [
  {
    id: "1",
    date: "2024-01-15T10:30:00Z",
    type: "chat",
    duration: 45,
    cost: 1500,
    status: "completed",
    rating: 5,
    summary: "Консультация по семейному праву",
    specialist: "Иванов И.И.",
  },
  {
    id: "2",
    date: "2024-01-10T14:15:00Z",
    type: "voice",
    duration: 30,
    cost: 2000,
    status: "completed",
    rating: 4,
    summary: "Вопросы по трудовому договору",
    specialist: "Петрова А.С.",
  },
  {
    id: "3",
    date: "2024-01-05T16:45:00Z",
    type: "video",
    duration: 60,
    cost: 3000,
    status: "completed",
    rating: 5,
    summary: "Консультация по недвижимости",
    specialist: "Сидоров В.П.",
  },
]

export default function HistoryPage() {
  const { userProfile } = useAuth()
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations)
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>(mockConsultations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Фильтрация консультаций
  useEffect(() => {
    let filtered = consultations

    if (searchTerm) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.specialist?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((consultation) => consultation.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((consultation) => consultation.type === typeFilter)
    }

    setFilteredConsultations(filtered)
  }, [consultations, searchTerm, statusFilter, typeFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    )
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "voice":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Calendar className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "chat":
        return "Чат"
      case "voice":
        return "Голосовая"
      case "video":
        return "Видео"
      default:
        return "Неизвестно"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Завершена
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Отменена</Badge>
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            В процессе
          </Badge>
        )
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  // Статистика
  const totalConsultations = consultations.length
  const completedConsultations = consultations.filter((c) => c.status === "completed").length
  const totalSpent = consultations.reduce((sum, c) => sum + c.cost, 0)
  const averageRating = consultations
    .filter((c) => c.rating)
    .reduce((sum, c, _, arr) => sum + (c.rating || 0) / arr.length, 0)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к профилю
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">История консультаций</h1>
        <p className="text-gray-500 mt-2">Просматривайте историю ваших консультаций и оценки</p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего консультаций</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedConsultations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Потрачено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toLocaleString()} тг</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Средняя оценка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Все консультации</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Все консультации</CardTitle>
              <CardDescription>Полная история ваших консультаций</CardDescription>

              {/* Фильтры */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Поиск по теме или специалисту..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="completed">Завершена</SelectItem>
                    <SelectItem value="cancelled">Отменена</SelectItem>
                    <SelectItem value="in_progress">В процессе</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="chat">Чат</SelectItem>
                    <SelectItem value="voice">Голосовая</SelectItem>
                    <SelectItem value="video">Видео</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredConsultations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead>Специалист</TableHead>
                      <TableHead>Длительность</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Оценка</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell>{formatDate(consultation.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(consultation.type)}
                            <span>{getTypeLabel(consultation.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{consultation.summary}</TableCell>
                        <TableCell>{consultation.specialist}</TableCell>
                        <TableCell>{formatDuration(consultation.duration)}</TableCell>
                        <TableCell>{consultation.cost.toLocaleString()} тг</TableCell>
                        <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                        <TableCell>{renderStars(consultation.rating)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">Консультации не найдены</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Завершенные консультации</CardTitle>
              <CardDescription>Консультации, которые были успешно завершены</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Аналогичная таблица, но только для завершенных */}
              <div className="text-center py-8 text-gray-500">Показать только завершенные консультации</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Отмененные консультации</CardTitle>
              <CardDescription>Консультации, которые были отменены</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">Показать только отмененные консультации</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
