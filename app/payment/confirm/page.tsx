"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { handlePaymentResult } from "@/lib/payment-api"
import Link from "next/link"

export default function PaymentConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    newBalance?: string
  } | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const status = searchParams.get("status")

    if (!paymentId || !status) {
      setResult({
        success: false,
        message: "Отсутствуют необходимые параметры платежа",
      })
      setLoading(false)
      return
    }

    const processPayment = async () => {
      try {
        const paymentResult = await handlePaymentResult(paymentId, status as "success" | "failure")
        setResult(paymentResult)
      } catch (error) {
        console.error("Error processing payment:", error)
        setResult({
          success: false,
          message: error instanceof Error ? error.message : "Произошла ошибка при обработке платежа",
        })
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [searchParams])

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Результат оплаты</CardTitle>
          <CardDescription>Информация о вашем платеже</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
              <p className="text-gray-500">Проверка статуса платежа...</p>
            </div>
          ) : result?.success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Оплата успешна!</AlertTitle>
              <AlertDescription className="text-green-700">
                <p>{result.message}</p>
                {result.newBalance && <p className="mt-2">Ваш новый баланс: {result.newBalance} тг</p>}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Ошибка оплаты</AlertTitle>
              <AlertDescription>{result?.message || "Произошла ошибка при обработке платежа"}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/profile/balance">Вернуться к управлению балансом</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
