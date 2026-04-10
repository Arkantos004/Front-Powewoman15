'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown } from 'lucide-react'

const userCourses = [
  { id: 1, title: 'Maquillaje Natural', progress: 75 },
  { id: 2, title: 'Técnicas Avanzadas', progress: 40 },
]

export default function MyCoursesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setShowAddForm(false)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Mis Cursos</h1>

            {/* Courses List */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Cursos Inscritos</h2>
              <div className="space-y-4">
                {userCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-lg p-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full flex items-center justify-between font-bold mb-6 text-lg"
              >
                <span>¿Quieres más cursos?</span>
                <ChevronDown
                  className="h-5 w-5 transition-transform"
                  style={{
                    transform: showAddForm ? 'rotate(0deg)' : 'rotate(-90deg)',
                  }}
                />
              </button>

              {showAddForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nombre</label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Correo</label>
                    <Input
                      type="email"
                      placeholder="tu@correo.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      ¿Qué curso te interesa?
                    </label>
                    <Textarea
                      placeholder="Cuéntanos qué curso te gustaría tomar..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar Solicitud
                  </Button>

                  {submitted && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-semibold">
                      ✓ Mensaje enviado. Nos pondremos en contacto pronto
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
