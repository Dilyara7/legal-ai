"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertCircle, CreditCard, ArrowLeft, Plus, Minus, CheckCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { getUserBalance, createPayment, getTransactionHistory } from "@/lib/payment-api"
import type { Transaction } from "@/lib/types"
import Link from "next/link"

export default function BalancePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  const [balance, setBalance] = useState<number | null>(null)
  const [amount, setAmount] = useState<string>("500")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Загрузка баланса и истории транзакций при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance()
      fetchTransactions()
    }
  }, [isAuthenticated])

  // Функция для загрузки баланса
  const fetchBalance = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const balanceData = await getUserBalance()
      setBalance(balanceData)
    } catch (err) {
      console.error("Error fetching balance:", err)
      setError(err instanceof Error ? err.message : "Не удалось загрузить баланс")
    } finally {
      setIsLoading(false)
    }
  }

  // Функция для загрузки истории транзакций
  const fetchTransactions = async () => {
    setIsLoadingTransactions(true)

    try {
      const transactionsData = await getTransactionHistory()
      setTransactions(transactionsData)
    } catch (err) {
      console.error("Error fetching transactions:", err)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  // Функция для создания платежа
  const handleCreatePayment = async () => {
    setIsCreatingPayment(true)
    setError(null)
    setPaymentUrl(null)

    try {
      const amountValue = Number.parseFloat(amount)

      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Пожалуйста, введите корректную сумму")
      }

      const payment = await createPayment(amountValue)

      if (payment.confirmation_url) {
        setPaymentUrl(payment.confirmation_url)
        // Открываем страницу оплаты в новом окне
        window.open(payment.confirmation_url, "_blank")
      } else {
        throw new Error("Не удалось получить ссылку на оплату")
      }
    } catch (err) {
      console.error("Error creating payment:", err)
      setError(err instanceof Error ? err.message : "Не удалось создать платеж")
    } finally {
      setIsCreatingPayment(false)
    }
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Форматирование суммы
  const formatAmount = (amount: any) => {
    const num = Number(amount);
    if (isNaN(num)) return "0.00 тг";
    return num.toFixed(2) + " тг";
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к профилю
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Управление балансом</h1>
        <p className="text-gray-500 mt-2">Пополняйте баланс и отслеживайте историю транзакций</p>
      </div>

      {/* Текущий баланс */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Текущий баланс</CardTitle>
            <CardDescription>Ваш доступный баланс для консультаций</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span>Загрузка...</span>
              </div>
            ) : balance !== null ? (
              <div className="text-3xl font-bold">{formatAmount(balance)}</div>
            ) : (
              <div className="text-gray-500">Не удалось загрузить баланс</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Вкладки для пополнения и истории */}
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="deposit">Пополнение баланса</TabsTrigger>
          <TabsTrigger value="history">История транзакций</TabsTrigger>
        </TabsList>

        {/* Вкладка пополнения */}
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Пополнение баланса</CardTitle>
              <CardDescription>Выберите сумму пополнения и способ оплаты</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {paymentSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Оплата успешна!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Ваш баланс был успешно пополнен. Обновление может занять несколько минут.
                  </AlertDescription>
                </Alert>
              )}

              {paymentUrl && !paymentSuccess && (
                <Alert className="bg-blue-50 border-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Платеж создан</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Перейдите по ссылке для завершения оплаты. После успешной оплаты ваш баланс будет пополнен
                    автоматически.
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        className="bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                        onClick={() => window.open(paymentUrl, "_blank")}
                      >
                        Перейти к оплате
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Сумма пополнения (тг)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isCreatingPayment}
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    disabled={isCreatingPayment}
                  >
                    {value} тг
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreatePayment} disabled={isCreatingPayment} className="w-full">
                {isCreatingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание платежа...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Пополнить баланс
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Вкладка истории транзакций */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
              <CardDescription>Все операции по вашему балансу</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.description === "Пополнение" ? (
                              <Plus className="mr-1 h-4 w-4 text-green-500" />
                            ) : (
                              <Minus className="mr-1 h-4 w-4 text-red-500" />
                            )}
                            {transaction.description === "Пополнение" ? "Пополнение" : "Списание"}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={transaction.description === "Пополнение" ? "text-green-600" : "text-red-600"}>
                          {transaction.description === "Пополнение" ? "+" : "-"}
                          {formatAmount(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.event === "payment.succeeded"
                                ? "bg-green-100 text-green-800"
                                : transaction.event === "payment.waiting_for_capture"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.event === "payment.succeeded"
                              ? "Выполнено"
                              : transaction.event === "payment.waiting_for_capture"
                                ? "В обработке"
                                : "Ошибка"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">История транзакций пуста</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
