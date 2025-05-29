// API URL
const API_URL = "https://voice.eca.kz:2247"

// Обновим функцию getToken для более надежного получения токена
const getToken = () => {
  if (typeof window !== "undefined") {
    const sessionToken = sessionStorage.getItem("accessToken")
    const localToken = localStorage.getItem("accessToken")
    const cookieToken = getCookie("accessToken")

    console.log("API: Access tokens found in:", {
      sessionStorage: sessionToken ? "Yes" : "No",
      localStorage: localToken ? "Yes" : "No",
      cookies: cookieToken ? "Yes" : "No",
    })

    const token = sessionToken || localToken || cookieToken

    if (!token) {
      console.error("API: No access token found in any storage")
    }

    return token
  }
  return null
}

// Function to get a cookie value
const getCookie = (name: string) => {
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

// Обновим функцию sendMessage для обработки сетевых ошибок
export async function sendMessage(dialogId: string | null, content: string, file?: File) {
  const token = getToken()

  if (!token) {
    console.error("No authentication token found")
    throw new Error("Не авторизован. Пожалуйста, войдите в систему.")
  }

  try {
    // Проверим доступность API перед отправкой запроса
    try {
      await fetch(`${API_URL}`, {
        method: "HEAD",
        mode: "no-cors",
        timeout: 5000, // Добавим таймаут
      })
    } catch (error) {
      console.error("API server is not reachable:", error)
      throw new Error("Сервер недоступен. Пожалуйста, проверьте подключение к интернету.")
    }

    const formData = new FormData()
    formData.append("content", content)

    if (file) {
      formData.append("file", file)
    }

    if (dialogId) {
      formData.append("dialog_id", dialogId)
    }

    console.log(`Sending message to ${API_URL}/chat/`)
    console.log("With token:", token.substring(0, 15) + "...")

    const response = await fetch(`${API_URL}/chat/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
      body: formData,
      credentials: "include", // Include cookies in the request
    })

    console.log("Send message response status:", response.status)

    if (response.status === 401) {
      console.error("Authentication error (401)")
      throw new Error("Сессия истекла. Пожалуйста, войдите в систему заново.")
    }

    if (!response.ok) {
  const errorText = await response.text().catch(() => "Unknown error")

  if (response.status === 402) {
    // console.error("Ошибка оплаты (402):", errorText)
    throw new Error("Недостаточно средств для выполнения запроса.")
  }

  if (response.status === 401) {
    throw new Error("Сессия истекла. Пожалуйста, войдите в систему заново.")
  }

  console.error(`Error ${response.status}: ${response.statusText}. ${errorText}`)
  throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
}


    const data = await response.json()
    console.log("Message sent successfully, response:", data)
    return data
  } catch (error) {
    console.error("Error sending message:", error)

    // Проверим, является ли ошибка сетевой
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету.")
    }

    throw error
  }
}

export async function getDialogs() {
  const token = getToken()

  if (!token) {
    console.error("No authentication token found")
    throw new Error("Не авторизован. Пожалуйста, войдите в систему.")
  }

  try {
    console.log(`Fetching dialogs from ${API_URL}/dialogs/`)
    console.log("With token:", token.substring(0, 15) + "...")

    const response = await fetch(`${API_URL}/dialogs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    })

    console.log("Get dialogs response status:", response.status)

    if (response.status === 401) {
      console.error("Authentication error (401)")
      throw new Error("Сессия истекла. Пожалуйста, войдите в систему заново.")
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Error ${response.status}: ${response.statusText}. ${errorText}`)
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Dialogs fetched successfully, count:", data.length)
    return data
  } catch (error) {
    console.error("Error fetching dialogs:", error)
    throw error
  }
}

export async function getDialogMessages(dialogId: string) {
  const token = getToken()

  if (!token) {
    console.error("No authentication token found")
    throw new Error("Не авторизован. Пожалуйста, войдите в систему.")
  }

  try {
    console.log(`Fetching dialog messages from ${API_URL}/dialogs/${dialogId}/`)
    console.log("With token:", token.substring(0, 15) + "...")

    const response = await fetch(`${API_URL}/dialogs/${dialogId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    })

    console.log("Get dialog messages response status:", response.status)

    if (response.status === 401) {
      console.error("Authentication error (401)")
      throw new Error("Сессия истекла. Пожалуйста, войдите в систему заново.")
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Error ${response.status}: ${response.statusText}. ${errorText}`)
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log("Dialog messages fetched successfully, count:", data.messages?.length || 0)
    return data
  } catch (error) {
    console.error("Error fetching dialog messages:", error)
    throw error
  }
}

export async function deleteDialog(dialogId: string) {
  const token = getToken()

  if (!token) {
    console.error("No authentication token found")
    throw new Error("Не авторизован. Пожалуйста, войдите в систему.")
  }

  try {
    console.log(`Deleting dialog at ${API_URL}/dialogs/${dialogId}/delete/`)
    console.log("With token:", token.substring(0, 15) + "...")

    const response = await fetch(`${API_URL}/dialogs/${dialogId}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
    })

    console.log("Delete dialog response status:", response.status)

    if (response.status === 401) {
      console.error("Authentication error (401)")
      throw new Error("Сессия истекла. Пожалуйста, войдите в систему заново.")
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Error ${response.status}: ${response.statusText}. ${errorText}`)
      throw new Error(`Ошибка ${response.status}: ${response.statusText}. ${errorText}`)
    }

    console.log("Dialog deleted successfully")
    return true
  } catch (error) {
    console.error("Error deleting dialog:", error)
    throw error
  }
}
