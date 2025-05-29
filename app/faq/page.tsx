"use client"

import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"

export default function FAQ() {
  const { t } = useLanguage()

  return (
    <>
      {/* FAQ Section */}
      <main className="flex-grow text-center py-20 bg-gray-800 text-white">
        <h2 className="text-4xl font-bold">{t.faq.hero.title}</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{t.faq.hero.subtitle}</p>
      </main>

      {/* FAQ List */}
      <section className="py-16 px-6 container mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-8">{t.faq.questions.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 text-left">
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.faq.questions.howWorks.question}</h4>
            <p className="mt-2">{t.faq.questions.howWorks.answer}</p>
          </Card>
          <Card className="p-6 bg-white shadow-lg rounded-xl">
            <h4 className="text-xl font-semibold">{t.faq.questions.accuracy.question}</h4>
            <p className="mt-2">{t.faq.questions.accuracy.answer}</p>
          </Card>
        </div>
      </section>
    </>
  )
}
