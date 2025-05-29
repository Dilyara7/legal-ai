"use client"

import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function AboutAIAssistant() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow text-center py-20 bg-gray-800 text-white">
        <h2 className="text-4xl font-bold">{t.about.hero.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.about.hero.subtitle}</p>
      </main>

      {/* How It Works Section */}
      <section className="py-16 px-6 container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-8">{t.about.howItWorks.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.about.howItWorks.processing.title}</h4>
            <p className="mt-2">{t.about.howItWorks.processing.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.about.howItWorks.technologies.title}</h4>
            <p className="mt-2">{t.about.howItWorks.technologies.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.about.howItWorks.accuracy.title}</h4>
            <p className="mt-2">{t.about.howItWorks.accuracy.description}</p>
          </Card>
        </div>
      </section>
    </>
  )
}
