import { fetchWithAuth } from "./auth"

const API_BASE_URL = "https://voice.eca.kz:2247"

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

// Получение списка документов
export async function getDocuments(): Promise<DocumentTemplate[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/templates/`)

    if (!response.ok) {
      throw new Error("Failed to fetch documents")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching documents:", error)
    return []
  }
}

// Получение локализованного названия документа
export function getLocalizedTitle(doc: DocumentTemplate, language: string): string {
  switch (language) {
    case "en":
      return doc.title_en || doc.title
    case "ru":
      return doc.title_ru || doc.title
    case "kz":
      return doc.title_kk || doc.title
    default:
      return doc.title
  }
}

// Получение полного URL для скачивания файла
export function getDownloadUrl(tempfile: string): string {
  return `${API_BASE_URL}${tempfile}`
}
