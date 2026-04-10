'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
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
                  <CardTitle className="text-3xl">Suscribete a Nuestro Newsletter</CardTitle>
                  <CardDescription className="text-base mt-3">
                    Recibe las últimas noticias sobre cursos, productos y consejos
                    de belleza profesional directamente en tu correo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Tu correo electrónico</label>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Suscribirse
                    </Button>

                    {subscribed && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-semibold">
                        ✓ ¡Gracias por suscribirte! Revisa tu correo de confirmación
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      No compartiremos tu correo con terceros. Puedes desuscribirse en cualquier momento.
                    </p>
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
