'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react'
import { getMyInstructorCourses, deleteCourse } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

interface Course {
  id: number
  title: string
  description?: string
  image_url?: string
  price_cop: number
  is_published: boolean
  created_at: string
}

export default function InstructorDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return

    // Verificar que sea instructora aprobada
    if (!user?.is_instructor || !user?.instructor_approved) {
      router.push('/instructor/request')
      return
    }

    loadCourses()
  }, [user, loading, router])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await getMyInstructorCourses()
      setCourses(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: number) => {
    if (!confirm('¿Confirmas que quieres eliminar este curso? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await deleteCourse(courseId)
      setCourses(courses.filter(c => c.id !== courseId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando panel...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold">Panel de Instructora</h1>
                  <p className="text-muted-foreground mt-1">Gestiona tus cursos, módulos y lecciones</p>
                </div>
              </div>
              <Link href="/instructor/courses/create">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Crear Curso
                </Button>
              </Link>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                {error}
              </div>
            )}

            {/* Cursos Grid */}
            {courses.length === 0 ? (
              <div className="bg-card rounded-lg p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No tienes cursos aún</h2>
                <p className="text-muted-foreground mb-6">
                  Crea tu primer curso y comienza a compartir tu conocimiento
                </p>
                <Link href="/instructor/courses/create">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Crear Primer Curso
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition border border-border"
                  >
                    {/* Imagen */}
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-primary mt-1">
                          ${course.price_cop.toLocaleString('es-CO')}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        {course.is_published ? (
                          <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 text-xs font-semibold rounded">
                            ✓ Publicado
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-semibold rounded">
                            ⊘ Borrador
                          </span>
                        )}
                      </div>

                      {/* Botones */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/instructor/courses/${course.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                        </Link>
                        {course.is_published && (
                          <Link href={`/courses/${course.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Eye className="h-4 w-4" />
                              Ver
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
