import { fetchWithAuth } from "./auth"
import type { Transaction } from "./types"

// API URL
const API_URL = "https://voice.eca.kz:2247"

// Create a payment
export async function createPayment(amount: number, currency = "KZT", description = "Пополнение") {
  try {
    console.log(`Creating payment at ${API_URL}/payment/topup/`)

    const response = await fetchWithAuth(`${API_URL}/payment/topup/`, {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        description,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Payment created:", data)
    return data
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

// Get user balance
export async function getUserBalance() {
  try {
    console.log(`Fetching user balance from ${API_URL}/payment/balance/`)

    const response = await fetchWithAuth(`${API_URL}/payment/balance/`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Balance fetched:", data)
    return Number.parseFloat(data.balance)
  } catch (error) {
    console.error("Error fetching user balance:", error)
    throw error
  }
}

// Deduct fee from balance
export async function deductFeeFromBalance() {
  try {
    console.log(`Deducting fee at ${API_URL}/payment/balance/`)
    const response = await fetchWithAuth(`${API_URL}/payment/balance/`, {
      method: "POST",
    })

    if (!response.ok) {
      // для 402 сразу бросаем без логирования
      if (response.status === 402) {
        throw new Error("Недостаточно средств на балансе")
      }
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Fee deducted, new balance:", data)
    return Number.parseFloat(data.balance)
  } catch (error) {
    // если это именно недостаток средств, пробрасываем без console.error
    if (error instanceof Error && error.message.includes("Недостаточно средств")) {
      throw error
    }
    // для всех прочих ошибок — логируем
    console.error("Error deducting fee:", error)
    throw error
  }
}

// Confirm payment
export async function confirmPayment(paymentId: string, status: "success" | "failure") {
  try {
    console.log(`Confirming payment at ${API_URL}/payment/confirm/?payment_id=${paymentId}&status=${status}`)

    const response = await fetchWithAuth(`${API_URL}/payment/confirm/?payment_id=${paymentId}&status=${status}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Payment confirmation result:", data)
    return data
  } catch (error) {
    console.error("Error confirming payment:", error)
    throw error
  }
}

// Handle payment result after redirect from payment provider
export async function handlePaymentResult(paymentId: string, status: "success" | "failure") {
  try {
    const result = await confirmPayment(paymentId, status)

    if (result.success) {
      return {
        success: true,
        newBalance: result.new_balance,
        message: "Оплата успешно завершена",
      }
    } else {
      return {
        success: false,
        message: "Оплата не была завершена",
      }
    }
  } catch (error) {
    console.error("Error handling payment result:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Произошла ошибка при обработке платежа",
    }
  }
}

// Get transaction history
export async function getTransactionHistory(): Promise<Transaction[]> {
  try {
    console.log(`Fetching transaction history from ${API_URL}/payment/transactions/`)

    const response = await fetchWithAuth(`${API_URL}/payment/transactions/`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Transaction history fetched:", data)
    return data
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    throw error
  }
}
