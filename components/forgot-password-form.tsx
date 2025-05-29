"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function ForgotPasswordForm() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError(t.auth.forgotPassword.errors.emptyEmail)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t.auth.forgotPassword.errors.invalidEmail)
      return
    }

    try {
      setIsLoading(true)

      // Имитация запроса на сервер
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // В реальном приложении здесь будет запрос к API
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      // if (!response.ok) throw new Error('Не удалось отправить инструкции')

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.forgotPassword.errors.generalError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <section className="flex-grow text-center py-12 bg-gray-800 text-white flex flex-col justify-center">
        <h2 className="text-4xl font-bold">{t.auth.forgotPassword.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.auth.forgotPassword.subtitle}</p>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6 container mx-auto">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Link href="/login" className="text-gray-500 hover:text-gray-700 mr-2">
                <ArrowLeft size={18} />
              </Link>
              <CardTitle className="text-2xl">{t.auth.forgotPassword.formTitle}</CardTitle>
            </div>
            <CardDescription>{t.auth.forgotPassword.formSubtitle}</CardDescription>
          </CardHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

                <div className="space-y-2">
                  <Label htmlFor="email">{t.auth.forgotPassword.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Отправка..." : t.auth.forgotPassword.sendButton}
                </Button>

                <div className="text-center text-sm">
                  <Link href="/login" className="text-blue-600 hover:underline">
                    {t.auth.forgotPassword.backToLogin}
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-xl font-medium">{t.auth.forgotPassword.success.title}</h3>
                <p className="text-gray-600">{t.auth.forgotPassword.success.message.replace("{email}", email)}</p>
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/login">{t.auth.forgotPassword.success.backButton}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </section>
    </div>
  )
}
