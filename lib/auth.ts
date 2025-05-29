// API URL
const API_URL = "https://voice.eca.kz:2247"

// Флаг для включения режима разработки (без реального API)
const DEV_MODE = false // Установите в false для использования реального API

// Мок данных пользователя для режима разработки
const MOCK_USER = {
  user: 1,
  phone: null,
  birthday: null,
  name: null,
  surname: null,
  patronymic: null,
  avatar: null,
  additional_info: null,
}

// Дополнительные данные пользователя для отображения в интерфейсе
const MOCK_USER_DETAILS = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  is_active: true,
  date_joined: "2025-01-01T00:00:00Z",
}

// Функция для установки куки
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Функция для получения значения куки
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

// Функция для удаления куки
const removeCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// Function to get the current access token
export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    // Проверяем каждое хранилище отдельно и логируем результаты
    const sessionToken = sessionStorage.getItem("accessToken")
    const localToken = localStorage.getItem("accessToken")
    const cookieToken = getCookie("accessToken")

    console.log("Access tokens found in:", {
      sessionStorage: sessionToken ? "Yes" : "No",
      localStorage: localToken ? "Yes" : "No",
      cookies: cookieToken ? "Yes" : "No",
    })

    const token = sessionToken || localToken || cookieToken
    console.log(
      "Using token from:",
      token ? (sessionToken ? "sessionStorage" : localToken ? "localStorage" : "cookies") : "No token found",
    )

    return token
  }
  return null
}

// Function to get the refresh token
export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    const token =
      sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken") || getCookie("refreshToken")
    console.log("Retrieved refresh token:", token ? token.substring(0, 15) + "..." : "No token found")
    return token
  }
  return null
}

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    // В режиме разработки возвращаем фиктивный токен
    if (DEV_MODE) {
      const mockToken = "mock_refresh_token_" + Date.now()
      sessionStorage.setItem("accessToken", mockToken)
      setCookie("accessToken", mockToken)
      return mockToken
    }

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      console.error("No refresh token available")
      return null
    }

    console.log(`Refreshing token at ${API_URL}/api/token/refresh`)

    const response = await fetch(`${API_URL}/api/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
      credentials: "include", // Include cookies in the request
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Failed to refresh token: ${response.status} ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log("Token refresh successful, new token received")

    // Обновляем токен в хранилищах и куках
    if (localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", data.access)
      setCookie("accessToken", data.access)
    } else {
      sessionStorage.setItem("accessToken", data.access)
      setCookie("accessToken", data.access, 1) // Для session cookie устанавливаем короткий срок
    }

    return data.access
  } catch (error) {
    console.error("Error refreshing token:", error)
    // Очищаем токены при ошибке обновления
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
    removeCookie("accessToken")
    removeCookie("refreshToken")

    return null
  }
}

// Function to make authenticated API requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    // Get the access token
    let accessToken = getAccessToken()

    // Set up headers with the access token
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    }

    console.log(`Making authenticated request to ${url}`)
    console.log("Request headers:", headers)

    // Make the request
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Always include cookies
    })

    console.log("Response status:", response.status)

    // If the response is 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
      console.log("Received 401, attempting to refresh token")
      accessToken = await refreshAccessToken()

      // If token refresh was successful, retry the request
      if (accessToken) {
        console.log("Token refreshed, retrying request")
        headers["Authorization"] = `Bearer ${accessToken}`
        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include", // Always include cookies
        })
        console.log("Retry response status:", response.status)
      } else {
        console.log("Token refresh failed")
      }
    }

    return response
  } catch (error) {
    console.error("Network error during fetch:", error)
    throw new Error(
      `Network error: Unable to connect to the server. Please check your internet connection. Details: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
export const fetchWithAuthutf = async (url: string, options: RequestInit = {}) => {
  try {
    let accessToken = getAccessToken()

    const isFormData = options.body instanceof FormData

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...((!isFormData && options.headers) || {}),
    }

    // Make the request
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })

    // Handle 401
    if (response.status === 401) {
      accessToken = await refreshAccessToken()

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        })
      }
    }

    return response
  } catch (error) {
    console.error("Network error during fetch:", error)
    throw new Error(
      `Network error: Unable to connect to the server. Please check your internet connection. Details: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
// Function to check if user is logged in
export const isLoggedIn = () => {
  // В режиме разработки всегда считаем пользователя авторизованным
  if (DEV_MODE) return true

  const token = getAccessToken()
  console.log("Checking if logged in:", token ? "User is logged in" : "User is not logged in")
  return !!token
}

// Function to logout
export const logout = () => {
  console.log("Logging out, removing all tokens")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  sessionStorage.removeItem("accessToken")
  sessionStorage.removeItem("refreshToken")
  removeCookie("accessToken")
  removeCookie("refreshToken")
}

// Function to get user profile
export const getUserProfile = async () => {
  try {
    console.log(`Fetching user profile from ${API_URL}/api/userprofile`)

    const response = await fetchWithAuth(`${API_URL}/api/userprofile`)

    console.log("User profile response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      console.error(`Server responded with status ${response.status}: ${errorText}`)
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}. ${errorText}`)
    }

    const profileData = await response.json()
    console.log("User profile data:", profileData)

    // В режиме разработки объединяем мок данные профиля и пользователя
    if (DEV_MODE) {
      return { ...profileData, ...MOCK_USER_DETAILS }
    }

    return profileData
  } catch (error) {
    console.error("Error fetching user profile:", error)

    // В режиме разработки возвращаем мок данные даже при ошибке
    if (DEV_MODE) {
      console.log("DEV MODE: Returning mock user profile despite error")
      return { ...MOCK_USER, ...MOCK_USER_DETAILS }
    }

    throw error
  }
}

// Function to update user profile
export const updateUserProfile = async (profileData: any) => {
  try {
    console.log(`Updating user profile at ${API_URL}/api/userprofile`)

    const response = await fetchWithAuth(`${API_URL}/api/userprofile`, {
      method: "POST",
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`Failed to update profile: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user profile:", error)

    // В режиме разработки возвращаем успешный результат
    if (DEV_MODE) {
      return { ...MOCK_USER, ...profileData, success: true }
    }

    throw error
  }
}

// Добавим функцию для проверки доступности API
export const checkApiAvailability = async () => {
  try {
    console.log(`Checking API availability at ${API_URL}`)
    const response = await fetch(`${API_URL}/api/health-check`, {
      method: "GET",
      mode: "no-cors", // Используем no-cors для простой проверки доступности
    })
    console.log("API is available")
    return true
  } catch (error) {
    console.error("API is not available:", error)
    return false
  }
}
