// Типы для пользователя и профиля
export interface UserProfile {
  user: number
  phone: string | null
  birthday: string | null
  name: string | null
  surname: string | null
  patronymic: string | null
  avatar: string | null
  additional_info: string | null
  balance: number // Баланс пользователя
}

// Типы для платежей
export interface Payment {
  id: string
  amount: number
  status: "pending" | "succeeded" | "canceled"
  created_at: string
  payment_url?: string
}

// История транзакций
export interface Transaction {
  id: string
  amount: number
  type: "deposit" | "withdrawal"
  description: string
  created_at: string
  status: "completed" | "pending" | "failed"
}

// Типы для документов
export interface DocumentTemplate {
  id: string
  title: string
  title_en: string
  title_ru: string
  title_kk: string
  tempfile: string
  content: string
  created_at: string
  updated_at: string
}
