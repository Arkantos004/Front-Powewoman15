'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Search } from 'lucide-react'

const categories = [
  { id: 1, name: 'Maquillaje' },
  { id: 2, name: 'Belleza' },
  { id: 3, name: 'Emprendimiento' },
]

const courses = [
  { id: 1, title: 'Maquillaje Natural', price: 99900, category: 'Maquillaje', duration: '2.5h' },
  { id: 2, title: 'Técnicas Avanzadas', price: 149900, category: 'Belleza', duration: '4h' },
  { id: 3, title: 'Negocios de Belleza', price: 129900, category: 'Emprendimiento', duration: '3.5h' },
  { id: 4, title: 'Contouring Profesional', price: 119900, category: 'Maquillaje', duration: '3h' },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCoursesList, setShowCoursesList] = useState(true)

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Nuestros Cursos</h1>

            {/* Search */}
            <div className="max-w-2xl mb-8">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button className="gap-2">
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Categorías</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className="p-6 bg-card rounded-lg hover:shadow-lg transition-shadow text-center font-semibold hover:text-primary"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses List */}
            <div>
              <button
                onClick={() => setShowCoursesList(!showCoursesList)}
                className="flex items-center gap-2 font-bold mb-6 text-lg hover:text-primary transition-colors"
              >
                <ChevronDown
                  className="h-5 w-5 transition-transform"
                  style={{ transform: showCoursesList ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
                Catálogo de Cursos
              </button>

              {showCoursesList && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.category} • {course.duration}
                        </p>
                        <p className="text-lg font-bold text-primary mb-4">${course.price.toLocaleString('es-CO')}</p>
                        <Button className="w-full" size="sm">
                          Ver Curso
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
