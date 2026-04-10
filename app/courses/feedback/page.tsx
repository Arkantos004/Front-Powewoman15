'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EventFeedbackPage() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [futureEvents, setFutureEvents] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating && feedback && futureEvents) {
      setSubmitted(true)
      setTimeout(() => {
        setRating(0)
        setFeedback('')
        setFutureEvents('')
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Feedback del Evento</CardTitle>
                  <CardDescription className="text-base mt-3">
                    Tu opinión nos ayuda a mejorar. Gracias por tu tiempo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold">
                        ¿Cómo calificarías el evento?
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className={`w-10 h-10 rounded font-bold transition ${
                              rating === value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">
                        Comparte tu opinión
                      </label>
                      <Textarea
                        placeholder="¿Qué te pareció? ¿Qué podemos mejorar?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="resize-none"
                      />
                    </div>

                    {/* Future Events */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold">
                        ¿Asistirías a futuros eventos?
                      </label>
                      <div className="space-y-2">
                        {['Sí', 'Tal vez', 'No'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setFutureEvents(option.toLowerCase())
                            }
                            className={`w-full p-3 rounded font-semibold transition ${
                              futureEvents === option.toLowerCase()
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar Feedback
                    </Button>

                    {submitted && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-semibold">
                        ✓ ¡Gracias por tu feedback!
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
