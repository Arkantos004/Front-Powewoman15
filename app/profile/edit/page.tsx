'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: 'María González',
    email: 'maria@example.com',
    phone: '+57 3001234567',
    bio: 'Apasionada por el maquillaje profesional',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Editar Perfil</h1>

            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre completo</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Correo electrónico</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Teléfono</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Biografía</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Guardar Cambios
                </Button>
                <Link href="/profile" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>

              {saved && (
                <p className="text-center text-green-600 font-semibold">
                  ✓ Perfil actualizado correctamente
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
