import { fetchWithAuth,fetchWithAuthutf } from "@/lib/auth"

const API_URL = "https://voice.eca.kz:2247"

export interface UserProfileData {
  name: string
  surname: string
  patronymic: string
  phone: string
  birthday: string
  additional_info: string
  avatar?: string | null
}
export interface UserStats {
  totalConsultations: number
  completedConsultations: number
  totalSpent: number
  currentBalance: number
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

// API функции для профиля
export const ProfileAPI = {
  // Получение данных профиля
  async getProfile(): Promise<UserProfileData> {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/userprofile`)

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }

      const data = await response.json()

      return {
        name: data.name || "",
        surname: data.surname || "",
        patronymic: data.patronymic || "",
        phone: data.phone || "",
        birthday: data.birthday || "",
        additional_info: data.additional_info || "",
        avatar: data.avatar || null,
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      // Возвращаем пустые данные при ошибке
      return {
        name: "",
        surname: "",
        patronymic: "",
        phone: "",
        birthday: "",
        additional_info: "",
        avatar: null,
      }
    }
  },

  // Сохранение данных профиля
 async saveProfile(data: UserProfileData): Promise<boolean> {
  try {
    // Проверка обязательных полей
    if (!data.name || !data.surname || !data.phone || !data.birthday) {
      throw new Error("Все обязательные поля (имя, фамилия, телефон, дата рождения) должны быть заполнены")
    }

    const response = await fetchWithAuth(`${API_URL}/api/userprofile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: data.phone,
        birthday: data.birthday?.split("T")[0], // "YYYY-MM-DD"
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        additional_info: data.additional_info,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to save profile: ${response.status} ${errorText}`)
    }

    return true
  } catch (error) {
    console.error("Error saving profile:", error)
    throw error
  }
},


  // Загрузка аватара
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetchWithAuthutf(`${API_URL}/api/userprofile`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to upload avatar: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      return data.avatar || ""
    } catch (error) {
      console.error("Error uploading avatar:", error)
      throw error
    }
  },
  async getStats(): Promise<UserStats> {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/userstats/`)

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }

      const data = await response.json()

      return {
        totalConsultations: data.totalConsultations || 0,
        completedConsultations: data.completedConsultations || 0,
        totalSpent: data.totalSpent || 0,
        currentBalance: data.currentBalance || 0,
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Возвращаем безопасные значения по умолчанию
      return {
        totalConsultations: 0,
        completedConsultations: 0,
        totalSpent: 0,
        currentBalance: 0,
      }
    }
  },
}

// Локальное хранение для настроек (не связанных с API)
const STORAGE_KEYS = {
  NOTIFICATIONS: "notificationSettings",
  SECURITY: "securitySettings",
  INTERFACE: "interfaceSettings",
} as const

// Функции для настроек уведомлений (локально)
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
    // TODO: В будущем можно добавить API для сохранения настроек уведомлений
  },
}

// Функции для настроек безопасности (локально)
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
    // TODO: В будущем можно добавить API для сохранения настроек безопасности
  },
}

// Функции для настроек интерфейса (локально)
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
    // TODO: В будущем можно добавить API для сохранения настроек интерфейса
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
