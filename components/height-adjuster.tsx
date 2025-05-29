"use client"

import { useEffect, useRef } from "react"

export default function HeightAdjuster() {
  const headerRef = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    // Функция для измерения высоты элементов и установки CSS-переменных
    const updateHeights = () => {
      const header = document.querySelector("header")
      const footer = document.querySelector("footer")

      if (header && footer) {
        const headerHeight = header.offsetHeight
        const footerHeight = footer.offsetHeight

        // Устанавливаем CSS-переменные
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`)
        document.documentElement.style.setProperty("--footer-height", `${footerHeight}px`)
        document.documentElement.style.setProperty(
          "--content-height",
          `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
        )
      }
    }

    // Вызываем функцию при монтировании компонента
    updateHeights()

    // Добавляем обработчик события изменения размера окна
    window.addEventListener("resize", updateHeights)

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener("resize", updateHeights)
    }
  }, [])

  return null // Компонент не рендерит никакой UI
}
