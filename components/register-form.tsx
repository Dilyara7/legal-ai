"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/components/language-provider"

// API URL
const API_URL = "https://voice.eca.kz:2247"

export default function RegisterForm() {
  const router = useRouter()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = t.auth.register.errors.emptyUsername

    if (!formData.email.trim()) {
      newErrors.email = t.auth.register.errors.emptyEmail
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.auth.register.errors.invalidEmail
    }

    if (!formData.password) {
      newErrors.password = t.auth.register.errors.emptyPassword
    } else if (formData.password.length < 8) {
      newErrors.password = t.auth.register.errors.shortPassword
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.register.errors.passwordMismatch
    }

    if (!agreeTerms) {
      newErrors.terms = t.auth.register.errors.agreeTerms
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      console.log(`Registering user at ${API_URL}/api/register`)

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error messages from the backend
        if (data.username) {
          setErrors({ username: data.username[0] })
        } else if (data.email) {
          setErrors({ email: data.email[0] })
        } else if (data.password) {
          setErrors({ password: data.password[0] })
        } else {
          throw new Error(t.auth.register.errors.generalError)
        }
        return
      }

      // Store tokens if the backend returns them
      if (data.access && data.refresh) {
        sessionStorage.setItem("accessToken", data.access)
        sessionStorage.setItem("refreshToken", data.refresh)
      }

      // Redirect to login page with success parameter
      router.push("/login?registered=true")
    } catch (err) {
      console.error("Registration error:", err)
      setErrors({ form: err instanceof Error ? err.message : t.auth.register.errors.generalError })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <section className="flex-grow text-center py-12 bg-gray-800 text-white flex flex-col justify-center">
        <h2 className="text-4xl font-bold">{t.auth.register.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.auth.register.subtitle}</p>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 px-6 container mx-auto">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t.auth.register.formTitle}</CardTitle>
            <CardDescription>{t.auth.register.formSubtitle}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.form && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{errors.form}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">{t.auth.register.username}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="username"
                    className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.register.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.ru"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.register.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.auth.register.confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  disabled={isLoading}
                  className={errors.terms ? "border-red-500" : ""}
                />
                <div>
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    {t.auth.register.agreeTerms}{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      {t.auth.register.termsLink}
                    </Link>{" "}
                    и{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      {t.auth.register.privacyLink}
                    </Link>
                  </Label>
                  {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : t.auth.register.registerButton}
              </Button>

              <div className="text-center text-sm">
                {t.auth.register.haveAccount}{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  {t.auth.register.loginLink}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </section>
    </div>
  )
}
