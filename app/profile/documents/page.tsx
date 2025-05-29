"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Upload, Download, Eye, FileText, File, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

// Типы для документов
interface Document {
  id: string
  name: string
  type: "contract" | "certificate" | "report" | "other"
  size: number
  uploadDate: string
  status: "active" | "archived" | "expired"
  downloadUrl?: string
}

// Моковые данные
const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Договор на консультацию №001",
    type: "contract",
    size: 245760,
    uploadDate: "2024-01-15T10:30:00Z",
    status: "active",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "Справка о консультации",
    type: "certificate",
    size: 156432,
    uploadDate: "2024-01-10T14:15:00Z",
    status: "active",
    downloadUrl: "#",
  },
  {
    id: "3",
    name: "Отчет по делу №123",
    type: "report",
    size: 512000,
    uploadDate: "2024-01-05T16:45:00Z",
    status: "archived",
    downloadUrl: "#",
  },
]

export default function DocumentsPage() {
  const { userProfile } = useAuth()
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract":
        return <FileText className="h-4 w-4" />
      case "certificate":
        return <File className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "contract":
        return "Договор"
      case "certificate":
        return "Справка"
      case "report":
        return "Отчет"
      case "other":
        return "Другое"
      default:
        return "Неизвестно"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Активный
          </Badge>
        )
      case "archived":
        return <Badge variant="secondary">Архивный</Badge>
      case "expired":
        return <Badge variant="destructive">Истек</Badge>
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    // Имитация загрузки файла
    setTimeout(() => {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: "other",
        size: selectedFile.size,
        uploadDate: new Date().toISOString(),
        status: "active",
      }

      setDocuments((prev) => [newDocument, ...prev])
      setSelectedFile(null)
      setIsUploading(false)
    }, 2000)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const activeDocuments = filteredDocuments.filter((doc) => doc.status === "active")
  const archivedDocuments = filteredDocuments.filter((doc) => doc.status === "archived")

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к профилю
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Мои документы</h1>
        <p className="text-gray-500 mt-2">Управляйте своими документами и файлами</p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего документов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDocuments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Архивные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{archivedDocuments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Все документы</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="archived">Архивные</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Все документы</CardTitle>
              <CardDescription>Управление всеми вашими документами</CardDescription>

              {/* Поиск и загрузка */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Input
                  placeholder="Поиск документов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Загрузить документ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Загрузить новый документ</DialogTitle>
                      <DialogDescription>Выберите файл для загрузки в ваше хранилище документов</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Нажмите для выбора файла
                            </span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                          </label>
                          <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX до 10MB</p>
                        </div>
                      </div>

                      {selectedFile && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                            <Button onClick={handleFileUpload} disabled={isUploading}>
                              {isUploading ? "Загрузка..." : "Загрузить"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Дата загрузки</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(document.type)}
                            <span>{document.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeLabel(document.type)}</TableCell>
                        <TableCell>{formatFileSize(document.size)}</TableCell>
                        <TableCell>{formatDate(document.uploadDate)}</TableCell>
                        <TableCell>{getStatusBadge(document.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(document.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">Документы не найдены</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Активные документы</CardTitle>
              <CardDescription>Документы, которые в настоящее время активны</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">Показать только активные документы</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Архивные документы</CardTitle>
              <CardDescription>Документы, которые были перемещены в архив</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">Показать только архивные документы</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
