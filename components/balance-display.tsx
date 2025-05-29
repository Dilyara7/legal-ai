"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CreditCard } from "lucide-react"
import Link from "next/link"
import { getUserBalance } from "@/lib/payment-api"

export default function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBalance()
  }, [])

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

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return amount.toFixed(2) + " тг"
  }

  return (
    <Card className="p-4 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xl font-semibold">Баланс</h4>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-gray-500">Загрузка...</span>
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          ) : (
            <p className="text-2xl font-bold mt-1">{formatAmount(balance || 0)}</p>
          )}
        </div>
        <Button asChild>
          <Link href="/profile/balance">
            <CreditCard className="mr-2 h-4 w-4" />
            Пополнить
          </Link>
        </Button>
      </div>
    </Card>
  )
}
