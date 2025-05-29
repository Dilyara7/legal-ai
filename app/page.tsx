"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <section className="flex-grow text-center py-20 bg-gray-800 text-white flex flex-col justify-center">
        <h2 className="text-4xl font-bold">{t.home.hero.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.home.hero.subtitle}</p>
        <div className="mt-6">
          <Button className="bg-white text-black text-lg px-6 py-3" asChild>
            <Link href="/chat">{t.buttons.startConsultation}</Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-8">{t.home.benefits.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.home.benefits.fast.title}</h4>
            <p className="mt-2">{t.home.benefits.fast.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.home.benefits.ai.title}</h4>
            <p className="mt-2">{t.home.benefits.ai.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.home.benefits.confidentiality.title}</h4>
            <p className="mt-2">{t.home.benefits.confidentiality.description}</p>
          </Card>
        </div>
      </section>
    </div>
  )
}
