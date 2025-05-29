"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaDownload, FaFileAlt, FaExclamationTriangle } from "react-icons/fa"
import { useLanguage } from "@/components/language-provider"
import { getDocuments, getLocalizedTitle, getDownloadUrl, type DocumentTemplate } from "@/lib/documents-api"

export default function DocumentGeneratorPage() {
  const { t, language } = useLanguage()
  const [documents, setDocuments] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (err) {
      setError("Ошибка при загрузке документов")
      console.error("Error loading documents:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 bg-gray-800 text-white">
          <h2 className="text-4xl font-bold">{t.documents.hero.title}</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">{t.documents.hero.subtitle}</p>
        </section>

        {/* Document List */}
        <section className="py-16 px-6 container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-semibold">{t.documents.available.title}</h3>
            <Button onClick={loadDocuments} variant="outline" disabled={loading}>
              {loading ? "Загрузка..." : "Обновить"}
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <Alert className="mb-6">
              <FaExclamationTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button variant="link" className="ml-2 p-0 h-auto" onClick={loadDocuments}>
                  Попробовать снова
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <DocumentSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Documents Grid */}
          {!loading && !error && (
            <>
              {documents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} language={language} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">Документы не найдены</h4>
                  <p className="text-gray-500">В данный момент нет доступных документов для скачивания</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}

function DocumentCard({
  document:doc,
  language,
}: {
  document: DocumentTemplate
  language: string
}) {
  const { t } = useLanguage()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setDownloading(true)
      const downloadUrl = getDownloadUrl(doc.tempfile)

      // Создаем ссылку для скачивания
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = getLocalizedTitle(doc, language)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl text-center flex flex-col items-center hover:shadow-xl transition-shadow">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
        <FaFileAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
      </div>

      <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {getLocalizedTitle(doc, language)}
      </h4>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Создан: {new Date(doc.created_at).toLocaleDateString()}
      </p>

      <Button onClick={handleDownload} disabled={downloading} className="w-full">
        {downloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Скачивание...
          </>
        ) : (
          <>
            <FaDownload className="mr-2" />
            {t.buttons.download}
          </>
        )}
      </Button>
    </Card>
  )
}

function DocumentSkeleton() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl text-center flex flex-col items-center">
      <Skeleton className="w-16 h-16 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full" />
    </Card>
  )
}
