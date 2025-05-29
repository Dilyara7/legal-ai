"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Upload, Bell, Shield, User, Palette, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import {
  ProfileAPI,
  NotificationStorage,
  SecurityStorage,
  InterfaceStorage,
  type UserProfileData,
  type NotificationSettings,
  type SecuritySettings,
  type InterfaceSettings,
} from "@/lib/profile-api"

export default function SettingsPage() {
  const { refreshUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  // Состояние для формы профиля
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "",
    surname: "",
    patronymic: "",
    phone: "",
    birthday: "",
    additional_info: "",
    avatar: null,
  })

  // Состояние для загрузки аватара
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Состояние для настроек
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    consultationReminders: true,
    promotionalEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginNotifications: true,
  })

  const [interfaceSettings, setInterfaceSettings] = useState<InterfaceSettings>({
    theme: "light",
    language: "ru",
    timezone: "Europe/Moscow",
  })

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные профиля из API
        const profile = await ProfileAPI.getProfile()
        setProfileData(profile)
        // console.log("Loaded profile data:", profile.avatar)
        const avatarUrl ="https://voice.eca.kz:2247"+ profile.avatar || null
        setAvatarPreview(avatarUrl)

        // Загружаем настройки из localStorage
        setNotificationSettings(NotificationStorage.get())
        setSecuritySettings(SecurityStorage.get())
        setInterfaceSettings(InterfaceStorage.get())
      } catch (error) {
        console.error("Error loading profile data:", error)
        setError("Ошибка загрузки данных профиля")
      }
    }

    loadData()
  }, [])

  const showSuccessMessage = () => {
    setSaveSuccess(true)
    setError(null)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setSaveSuccess(false)
    setTimeout(() => setError(null), 5000)
  }

 const handleProfileSave = async () => {
    setIsLoading(true)
    setError(null)
    const errors: Record<string, string> = {}

    if (!profileData.name) errors.name = "Имя обязательно"
    if (!profileData.surname) errors.surname = "Фамилия обязательна"
    if (!profileData.phone) errors.phone = "Телефон обязателен"
    if (!profileData.birthday) errors.birthday = "Дата рождения обязательна"

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    setFieldErrors({}) // очищаем старые ошибки

    try {
      await ProfileAPI.saveProfile(profileData)
      await refreshUserProfile()
      showSuccessMessage()
    } catch (error) {
      console.error("Error saving profile:", error)
      showError("Ошибка сохранения профиля")
    } finally {
      setIsLoading(false)
    } 
  }



  // Обработчик выбора файла аватара
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      showError("Пожалуйста, выберите изображение")
      return
    }

    // Проверка размера файла (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError("Размер файла не должен превышать 2MB")
      return
    }

    setAvatarFile(file)

    // Создание превью
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  // Загрузка аватара
  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    setIsUploadingAvatar(true)
    setError(null)

    try {
      const avatarUrl = await ProfileAPI.uploadAvatar(avatarFile)

      // Обновляем данные профиля
      const updatedProfile = { ...profileData, avatar: avatarUrl }
      setProfileData(updatedProfile)
      setAvatarPreview(avatarUrl)

      await refreshUserProfile()
      showSuccessMessage()

      setAvatarFile(null)
    } catch (error) {
      console.error("Error uploading avatar:", error)
      showError("Ошибка при загрузке фото")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Отмена выбора аватара
  const handleAvatarCancel = () => {
    setAvatarFile(null)
    setAvatarPreview(profileData.avatar)
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    try {
      NotificationStorage.save(notificationSettings)
      showSuccessMessage()
    } catch (error) {
      console.error("Error saving notifications:", error)
      showError("Ошибка сохранения настроек уведомлений")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecuritySave = async () => {
    setIsLoading(true)
    try {
      SecurityStorage.save(securitySettings)
      showSuccessMessage()
    } catch (error) {
      console.error("Error saving security settings:", error)
      showError("Ошибка сохранения настроек безопасности")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterfaceSave = async () => {
    setIsLoading(true)
    try {
      InterfaceStorage.save(interfaceSettings)
      showSuccessMessage()
    } catch (error) {
      console.error("Error saving interface settings:", error)
      showError("Ошибка сохранения настроек интерфейса")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к профилю
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-gray-500 mt-2">Управляйте настройками вашего аккаунта</p>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">Настройки успешно сохранены!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Безопасность</span>
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Интерфейс</span>
          </TabsTrigger>
        </TabsList>

        {/* Вкладка профиля */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Информация профиля</CardTitle>
              <CardDescription>Обновите информацию о себе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Аватар */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                  <AvatarFallback>
                    {profileData.name?.charAt(0) || profileData.surname?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Выбрать фото
                      </label>
                    </Button>
                    {avatarFile && (
                      <>
                        <Button onClick={handleAvatarUpload} disabled={isUploadingAvatar}>
                          {isUploadingAvatar ? "Загрузка..." : "Сохранить"}
                        </Button>
                        <Button variant="ghost" onClick={handleAvatarCancel}>
                          Отмена
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">JPG, PNG до 2MB</p>
                  {avatarFile && <p className="text-sm text-green-600">Выбран файл: {avatarFile.name}</p>}
                </div>
              </div>

              {/* Основная информация */}
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="surname">Фамилия</Label>
                  <Input
                    id="surname"
                    value={profileData.surname}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, surname: e.target.value }))}
                  />
                  {fieldErrors.surname && <p className="text-sm text-red-500">{fieldErrors.surname}</p>}
                </div>
               <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  className={fieldErrors.name ? "border-red-500" : ""}
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                />
                {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
              </div>
                <div className="space-y-2">
                  <Label htmlFor="patronymic">Отчество</Label>
                  <Input
                    id="patronymic"
                    value={profileData.patronymic}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, patronymic: e.target.value }))}
                  />
                  {fieldErrors.patronymic && <p className="text-sm text-red-500">{fieldErrors.patronymic}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  {fieldErrors.phone && <p className="text-sm text-red-500">{fieldErrors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Дата рождения</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={profileData.birthday}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, birthday: e.target.value }))}
                  />
                  {fieldErrors.birthday && <p className="text-sm text-red-500">{fieldErrors.birthday}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">Дополнительная информация</Label>
                <Textarea
                  id="additional_info"
                  value={profileData.additional_info}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, additional_info: e.target.value }))}
                  placeholder="Расскажите о себе..."
                />
                {fieldErrors.additional_info && (
                  <p className="text-sm text-red-500">{fieldErrors.additional_info}</p>
                )}
              </div>

              <Button onClick={handleProfileSave} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Остальные вкладки остаются без изменений */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Управляйте способами получения уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-gray-500">Получать уведомления на email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS уведомления</Label>
                    <p className="text-sm text-gray-500">Получать SMS на телефон</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-gray-500">Уведомления в браузере</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Напоминания о консультациях</Label>
                    <p className="text-sm text-gray-500">Напоминания за час до консультации</p>
                  </div>
                  <Switch
                    checked={notificationSettings.consultationReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, consultationReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Рекламные рассылки</Label>
                    <p className="text-sm text-gray-500">Информация о скидках и акциях</p>
                  </div>
                  <Switch
                    checked={notificationSettings.promotionalEmails}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, promotionalEmails: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationSave} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
              <CardDescription>Управляйте безопасностью вашего аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Двухфакторная аутентификация</Label>
                    <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Время сессии (минуты)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 минут</SelectItem>
                      <SelectItem value="30">30 минут</SelectItem>
                      <SelectItem value="60">1 час</SelectItem>
                      <SelectItem value="120">2 часа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Уведомления о входе</Label>
                    <p className="text-sm text-gray-500">Уведомлять о новых входах в аккаунт</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings((prev) => ({ ...prev, loginNotifications: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSecuritySave} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>Настройки интерфейса</CardTitle>
              <CardDescription>Персонализируйте внешний вид приложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Тема оформления</Label>
                  <Select
                    value={interfaceSettings.theme}
                    onValueChange={(value: "light" | "dark" | "system") => {
                      const newSettings = { ...interfaceSettings, theme: value }
                      setInterfaceSettings(newSettings)
                      // Применяем тему сразу при изменении
                      InterfaceStorage.save(newSettings)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Светлая</SelectItem>
                      <SelectItem value="dark">Темная</SelectItem>
                      <SelectItem value="system">Системная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Язык интерфейса</Label>
                  <Select
                    value={interfaceSettings.language}
                    onValueChange={(value) => setInterfaceSettings((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="kz">Қазақша</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Часовой пояс</Label>
                  <Select
                    value={interfaceSettings.timezone}
                    onValueChange={(value) => setInterfaceSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Asia/Almaty">Алматы (UTC+6)</SelectItem>
                      <SelectItem value="Asia/Astana">Астана (UTC+6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleInterfaceSave} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
