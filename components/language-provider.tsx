"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, type Translations } from "@/lib/i18n/translations"

// Тип для контекста языка
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Провайдер языка
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Получаем сохраненный язык из localStorage или используем русский по умолчанию
  const [language, setLanguageState] = useState<Language>("ru")

  // Загружаем сохраненный язык при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["ru", "kz", "en"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Функция для изменения языка
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Получаем переводы для текущего языка
  const t = translations[language]

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Хук для использования языка
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
