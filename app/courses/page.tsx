'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Search } from 'lucide-react'
import { fetchCourses } from '@/lib/api'

const categories = [
  { id: 1, name: 'Maquillaje' },
  { id: 2, name: 'Belleza' },
  { id: 3, name: 'Emprendimiento' },
  { id: 4, name: 'Skincare' },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCoursesList, setShowCoursesList] = useState(true)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses()
        setCourses(data)
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  const filteredCourses = courses.filter(
    (course) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = !selectedCategory || course.category === selectedCategory
      
      return matchesSearch && matchesCategory
    }
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`p-6 rounded-lg transition-all ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card hover:shadow-lg hover:text-primary'
                  }`}
                >
                  <span className="font-semibold">Todos</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-6 rounded-lg transition-all text-center font-semibold ${
                      selectedCategory === cat.name
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card hover:shadow-lg hover:text-primary'
                    }`}
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
                <div>
                  {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Cargando cursos...
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No hay cursos disponibles {selectedCategory ? `en la categoría ${selectedCategory}` : ''}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                            {course.image_url || course.image ? (
                              <img
                                src={course.image_url || course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-4xl">📚</span>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {course.category || 'Sin categoría'} • {course.duration_hours ? `${course.duration_hours}h` : 'Duración no especificada'}
                            </p>
                            <p className="text-lg font-bold text-primary mb-4">
                              ${(course.price_cop || course.price || 0).toLocaleString('es-CO')}
                            </p>
                            <Button className="w-full" size="sm">
                              Ver Curso
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
