"use client"

import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function Services() {
  const { t } = useLanguage()

  return (
    <>
      {/* Services Section */}
      <main className="flex-grow text-center py-20 bg-gray-800 text-white">
        <h2 className="text-4xl font-bold">{t.services.hero.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.services.hero.subtitle}</p>
      </main>

      {/* Service List */}
      <section className="py-16 px-6 container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-8">{t.services.offerings.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.services.offerings.consultation.title}</h4>
            <p className="mt-2">{t.services.offerings.consultation.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.services.offerings.contracts.title}</h4>
            <p className="mt-2">{t.services.offerings.contracts.description}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.services.offerings.documents.title}</h4>
            <p className="mt-2">{t.services.offerings.documents.description}</p>
          </Card>
        </div>
      </section>
    </>
  )
}
