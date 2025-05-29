"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/components/ui/use-toast"

// API URL
const API_URL = "https://voice.eca.kz:2247"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const { t } = useLanguage()
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

  useEffect(() => {
    if (registered === "true") {
      setShowRegistrationSuccess(true)

      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [registered])

  // Обновим функцию handleSubmit для отправки данных в JSON формате, как ожидает сервер
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Пожалуйста, заполните все поля")
      return
    }

    try {
      setIsLoading(true)

      // Проверим доступность API перед отправкой запроса
      try {
        await fetch(`${API_URL}`, {
          method: "HEAD",
          mode: "no-cors",
        })
      } catch (error) {
        console.error("API server is not reachable:", error)
        throw new Error("Сервер недоступен. Пожалуйста, проверьте подключение к интернету.")
      }

      console.log("Sending login request to:", `${API_URL}/api/token`)
      console.log("With credentials:", { username })

      // Отправляем данные в формате JSON, как ожидает сервер
      const response = await fetch(`${API_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include", // Include cookies in the request
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Login error response:", errorData)
        throw new Error(errorData.detail || "Неверный логин или пароль")
      }

      const data = await response.json()
      console.log("Login successful, tokens received:", {
        access: data.access ? "Received" : "Missing",
        refresh: data.refresh ? "Received" : "Missing",
      })

      // Очищаем существующие токены перед сохранением новых
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("refreshToken")
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;"
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;"

      // Store tokens in localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage

      // Make sure we're storing the tokens with the correct keys
      storage.setItem("accessToken", data.access)
      storage.setItem("refreshToken", data.refresh)

      // Also set in cookies for redundancy
      document.cookie = `accessToken=${data.access}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `refreshToken=${data.refresh}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`

      console.log("Tokens stored successfully")

      // Проверим, что токены действительно сохранились
      const storedAccessToken = storage.getItem("accessToken")
      const storedRefreshToken = storage.getItem("refreshToken")
      const cookieAccessToken = getCookie("accessToken")

      console.log("Tokens verification:", {
        storage: {
          accessToken: storedAccessToken ? "Stored" : "Missing",
          refreshToken: storedRefreshToken ? "Stored" : "Missing",
        },
        cookies: {
          accessToken: cookieAccessToken ? "Stored" : "Missing",
        },
      })

      // Show success toast
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в систему!",
      })

      // Redirect to profile page after a short delay
      setTimeout(() => {
        console.log("Redirecting to profile page")
        router.push("/profile")
      }, 500)
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Произошла ошибка при входе")

      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: err instanceof Error ? err.message : "Произошла ошибка при входе",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Добавим функцию для получения cookie
  function getCookie(name: string) {
    if (typeof document === "undefined") return null

    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <section className="flex-grow text-center py-12 bg-gray-800 text-white flex flex-col justify-center">
        <h2 className="text-4xl font-bold">{t.auth.login.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.auth.login.subtitle}</p>
      </section>

      {/* Login Form Section */}
      <section className="py-16 px-6 container mx-auto">
        {showRegistrationSuccess && (
          <Alert className="max-w-md mx-auto mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Регистрация успешна!</AlertTitle>
            <AlertDescription className="text-green-700">
              Ваш аккаунт был успешно создан. Теперь вы можете войти в систему.
            </AlertDescription>
          </Alert>
        )}

        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t.auth.login.formTitle}</CardTitle>
            <CardDescription>{t.auth.login.formSubtitle}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">{t.auth.login.username}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">{t.auth.login.password}</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    {t.auth.login.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  {t.auth.login.rememberMe}
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : t.auth.login.loginButton}
              </Button>

              <div className="text-center text-sm">
                {t.auth.login.noAccount}{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  {t.auth.login.register}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </section>
    </div>
  )
}
