import { Suspense } from "react"
import LoginClientPage from "./client-page"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginClientPage />
    </Suspense>
  )
}