// Утилиты для локального хранения данных профиля

export interface UserProfileData {
  name: string
  surname: string
  patronymic: string
  phone: string
  birthday: string
  additional_info: string
  avatar: string | null
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  consultationReminders: boolean
  promotionalEmails: boolean
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: string
  loginNotifications: boolean
}

export interface InterfaceSettings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
}

// Ключи для localStorage
const STORAGE_KEYS = {
  PROFILE: "userProfile",
  NOTIFICATIONS: "notificationSettings",
  SECURITY: "securitySettings",
  INTERFACE: "interfaceSettings",
  AVATAR: "userAvatar",
} as const

// Функции для работы с профилем
export const ProfileStorage = {
  // Получение данных профиля
  getProfile(): UserProfileData {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE)
    return stored
      ? JSON.parse(stored)
      : {
          name: "",
          surname: "",
          patronymic: "",
          phone: "",
          birthday: "",
          additional_info: "",
          avatar: null,
        }
  },

  // Сохранение данных профиля
  saveProfile(data: UserProfileData): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data))

    // TODO: API вызов для сохранения на сервере
    // await updateUserProfile(data)
  },

  // Сохранение аватара (base64)
  saveAvatar(avatarDataUrl: string): void {
    localStorage.setItem(STORAGE_KEYS.AVATAR, avatarDataUrl)

    // TODO: API вызов для загрузки аватара на сервер
    // const formData = new FormData()
    // formData.append('avatar', file)
    // await uploadAvatar(formData)
  },

  // Получение аватара
  getAvatar(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AVATAR)
  },
}

// Функции для настроек уведомлений
export const NotificationStorage = {
  get(): NotificationSettings {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    return stored
      ? JSON.parse(stored)
      : {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          consultationReminders: true,
          promotionalEmails: false,
        }
  },

  save(settings: NotificationSettings): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings))

    // TODO: API вызов для сохранения настроек уведомлений
    // await updateNotificationSettings(settings)
  },
}

// Функции для настроек безопасности
export const SecurityStorage = {
  get(): SecuritySettings {
    const stored = localStorage.getItem(STORAGE_KEYS.SECURITY)
    return stored
      ? JSON.parse(stored)
      : {
          twoFactorAuth: false,
          sessionTimeout: "30",
          loginNotifications: true,
        }
  },

  save(settings: SecuritySettings): void {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(settings))

    // TODO: API вызов для сохранения настроек безопасности
    // await updateSecuritySettings(settings)
  },
}

// Функции для настроек интерфейса
export const InterfaceStorage = {
  get(): InterfaceSettings {
    const stored = localStorage.getItem(STORAGE_KEYS.INTERFACE)
    return stored
      ? JSON.parse(stored)
      : {
          theme: "light",
          language: "ru",
          timezone: "Europe/Moscow",
        }
  },

  save(settings: InterfaceSettings): void {
    localStorage.setItem(STORAGE_KEYS.INTERFACE, JSON.stringify(settings))

    // Применяем тему сразу
    applyTheme(settings.theme)

    // TODO: API вызов для сохранения настроек интерфейса
    // await updateInterfaceSettings(settings)
  },
}

// Применение темы
export const applyTheme = (theme: "light" | "dark" | "system") => {
  const root = document.documentElement

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.classList.toggle("dark", systemTheme === "dark")
  } else {
    root.classList.toggle("dark", theme === "dark")
  }

  // Сохраняем в localStorage для next-themes
  localStorage.setItem("theme", theme)
}

// Инициализация темы при загрузке
export const initializeTheme = () => {
  const settings = InterfaceStorage.get()
  applyTheme(settings.theme)
}
