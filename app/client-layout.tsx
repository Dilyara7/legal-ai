"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SupportChat from "@/components/support-chat"
import HeightAdjuster from "@/components/height-adjuster"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"
import "./globals.css"
import { getUserProfile, logout, getAccessToken } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ClientContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const checkAuth = () => {
      const token = getAccessToken()
      console.log("Client layout - checking auth token:", token ? "Token exists" : "No token")
      setAuthenticated(!!token)

      if (token) {
        fetchProfile()
      } else {
        setLoadingProfile(false)
      }
    }

    checkAuth()
  }, [])

  const fetchProfile = async () => {
    try {
      console.log("Fetching user profile...")
      const profile = await getUserProfile()
      if (profile) {
        console.log("Profile fetched successfully:", profile)
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить профиль пользователя",
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleLogout = () => {
    console.log("Logging out...")
    logout()
    setAuthenticated(false)
    setUserProfile(null)
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    })
    router.push("/login")
  }

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t.siteName}</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:underline">
                {t.nav.home}
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:underline">
                {t.nav.services}
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:underline">
                {t.nav.documents}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                {t.nav.faq}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex space-x-4 items-center">
          <LanguageSwitcher />

          {isClient && authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white text-black bg-white" disabled={loadingProfile}>
                  {loadingProfile ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </span>
                  ) : (
                    userProfile?.name || "Профиль"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">{t.nav.profile || "Профиль"}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.buttons.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="border-white text-black bg-white" asChild>
              <Link href="/login">{t.buttons.login}</Link>
            </Button>
          )}

          <Button variant="outline" className="border-white text-black bg-white" asChild>
            <Link href="/chat">{t.buttons.startConsultation}</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-6 mt-auto">
        <p>{t.footer.allRightsReserved}</p>
        <p>
          <Link href="/privacy" className="hover:underline">
            {t.footer.privacyPolicy}
          </Link>
        </p>
      </footer>

      <SupportChat />
      <HeightAdjuster />
    </div>
  )
}
