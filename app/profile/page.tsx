"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CreditCard,
  Settings,
  History,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
// import { ProfileStorage } from "@/lib/profile-storage"
import { ProfileAPI, type UserStats } from "@/lib/profile-api"
import type { UserProfileData } from "@/lib/profile-api"

export default function ProfilePage() {
  const { userProfile, isAuthenticated } = useAuth()
  const [localProfile, setLocalProfile] = useState<UserProfileData | null>(null)

  const [savedAvatar, setSavedAvatar] = useState<string | null>(null)

  // Загружаем локальные данные при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileAPI.getProfile()
        setLocalProfile(profile)
                // console.log("Loaded profile data:", profile.avatar)
                const avatarUrl ="https://voice.eca.kz:2247"+ profile.avatar || null
                setAvatarPreview(avatarUrl)
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error)
      }
    }

    loadProfile()
  }, [])

  // Мок данные для статистики (в будущем будут приходить с API)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await ProfileAPI.getStats()
        setStats(data)
      } catch (err) {
        setStatsError("Не удалось загрузить статистику")
      }
    }

    loadStats()
  }, [])

  // Функция для отображения полного имени
  const getFullName = () => {
    if (!localProfile) return <span>Загрузка...</span>

    const parts = [localProfile.surname, localProfile.name, localProfile.patronymic].filter(Boolean)
    return parts.length > 0 ? parts.join(" ") : userProfile?.username || "Пользователь"
  }

  // Функция для получения инициалов
  const getInitials = () => {
    if (localProfile.name || localProfile.surname) {
      return `${localProfile.surname?.charAt(0) || ""}${localProfile.name?.charAt(0) || ""}`.toUpperCase()
    }
    return userProfile?.username?.charAt(0)?.toUpperCase() || "U"
  }

  if (!isAuthenticated ) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-500 mb-4">Для просмотра профиля необходимо войти в систему</p>
          <Button asChild>
            <Link href="/login">Войти</Link>
          </Button>
        </div>
      </div>
    )
  }
if (!isAuthenticated || !localProfile) {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Загрузка профиля...</h1>
        <p className="text-gray-500 mb-4">Пожалуйста, подождите</p>
      </div>
    </div>
  )
}
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Левая колонка - Основная информация */}
        <div className="md:col-span-1 space-y-6">
          {/* Карточка профиля */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={savedAvatar || userProfile?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{getFullName()}</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Активный пользователь
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{userProfile.email}</span>
                </div>
              )}
              {localProfile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{localProfile.phone}</span>
                </div>
              )}
              {localProfile.birthday && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{new Date(localProfile.birthday).toLocaleDateString()}</span>
                </div>
              )}
              {userProfile?.date_joined && (
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">С нами с {new Date(userProfile.date_joined).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Дополнительная информация */}
          {localProfile.additional_info && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">О себе</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{localProfile.additional_info}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Правая колонка - Статистика и действия */}
        <div className="md:col-span-2 space-y-6">
          {/* Баланс */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Текущий баланс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  {stats ? (
                  <div className="text-3xl font-bold text-blue-600">{stats.currentBalance.toLocaleString()} тг</div>
                  ) : (
                    <div className="text-sm text-gray-500">Загрузка...</div>
                  )}
                  <p className="text-sm text-gray-600">Доступно для консультаций</p>
                </div>
                <Button asChild>
                  <Link href="/profile/balance">Пополнить</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Статистика */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Консультации</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="text-2xl font-bold">{stats.totalConsultations}</div>
                ) : (
                  <div className="text-sm text-gray-500">Загрузка...</div>
                )}
                {/* <p className="text-xs text-gray-500">
                  Завершено: {stats.completedConsultations} из {stats.totalConsultations}
                  
                </p> */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                 
                  {stats ? (
                   <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(stats.completedConsultations / stats.totalConsultations) * 100}%`,
                    }}
                  ></div>
                ) : (
                  <div className="text-sm text-gray-500">Загрузка...</div>
                )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Потрачено средств</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="text-2xl font-bold">{stats.totalSpent.toLocaleString()} тг</div>
                ) : (
                  <div className="text-sm text-gray-500">Загрузка...</div>
                )}
                <p className="text-xs text-gray-500">За все время</p>
              </CardContent>
            </Card>
          </div>

          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Быстрые действия</CardTitle>
              <CardDescription>Часто используемые функции</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button asChild className="h-12 justify-start">
                  <Link href="/chat">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Новая консультация
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 justify-start">
                  <Link href="/profile/balance">
                    <CreditCard className="mr-3 h-5 w-5" />
                    Пополнить баланс
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 justify-start">
                  <Link href="/chat">
                    <History className="mr-3 h-5 w-5" />
                    История диалогов
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 justify-start">
                  <Link href="/profile/settings">
                    <Settings className="mr-3 h-5 w-5" />
                    Настройки
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Основные разделы */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Управление профилем</CardTitle>
              <CardDescription>Основные разделы вашего аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href="/chat"
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <History className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">История диалогов</h3>
                    <p className="text-sm text-gray-500">Просмотр всех ваших консультаций</p>
                  </div>
                </div>
                <div className="text-right">
                  {stats ? (
                  <div className="text-lg font-semibold">{stats.totalConsultations}</div>
                  ) : (
                    <div className="text-sm text-gray-500">Загрузка...</div>
                  )}
                  <div className="text-xs text-gray-500">диалогов</div>
                </div>
              </Link>

              <Separator />

              <Link
                href="/profile/settings"
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Настройки профиля</h3>
                    <p className="text-sm text-gray-500">Персональные данные и настройки</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  )
}
