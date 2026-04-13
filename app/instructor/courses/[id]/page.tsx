'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import { getCourseDetail, updateCourse, uploadImage } from '@/lib/api'

interface Lesson {
  id: number
  title: string
  video_url?: string
  video_type?: string
  duration_minutes?: number
  order_number?: number
}

interface Module {
  id: number
  title: string
  description?: string
  order_number?: number
  lessons?: Lesson[]
}

interface Course {
  id: number
  title: string
  description?: string
  image_url?: string
  price_cop: number
  is_published: boolean
  modules?: Module[]
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = parseInt(params.id as string)

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  const [editingModule, setEditingModule] = useState<number | null>(null)
  const [editingLesson, setEditingLesson] = useState<number | null>(null)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setIsLoading(true)
      const data = await getCourseDetail(courseId)
      setCourse(data)
      if (data.modules) {
        setExpandedModules([data.modules[0]?.id || 0])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && course) {
      try {
        const result = await uploadImage(file)
        setCourse({ ...course, image_url: result.url })
      } catch (err: any) {
        setError(`Error al subir imagen: ${err.message}`)
      }
    }
  }

  const handleSaveCourse = async () => {
    if (!course) return
    
    setIsSaving(true)
    try {
      await updateCourse(courseId, {
        title: course.title,
        description: course.description,
        image_url: course.image_url,
        price_cop: course.price_cop,
        is_published: course.is_published,
      })
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando curso...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Curso no encontrado</p>
            <Link href="/instructor">
              <Button>Volver al Panel</Button>
            </Link>
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
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/instructor">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Editar Curso</h1>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                {error}
              </div>
            )}

            {/* Tabs */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-card rounded-lg p -4 space-y-4">
                  <h2 className="font-bold text-lg">Información</h2>
                  
                  {/* Status */}
                  <div>
                    <Label className="text-sm font-semibold">Estado</Label>
                    <div className="mt-2">
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
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={() => setCourse({ ...course, is_published: !course.is_published })}
                      className="w-full"
                      variant={course.is_published ? 'destructive' : 'default'}
                    >
                      {course.is_published ? 'Despublicar' : 'Publicar Curso'}
                    </Button>
                    <Button
                      onClick={handleSaveCourse}
                      disabled={isSaving}
                      className="w-full"
                      variant="outline"
                    >
                      {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Course Image */}
                <div className="bg-card rounded-lg p-4">
                  <Label className="text-sm font-semibold">Imagen del Curso</Label>
                  <div className="space-y-3 mt-3">
                    {course.image_url && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block text-sm"
                    />
                  </div>
                </div>

                {/* Course Details */}
                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="font-bold text-lg">Detalles del Curso</h2>
                  
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <textarea
                      value={course.description || ''}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-base mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Precio (COP)</Label>
                    <Input
                      type="number"
                      value={course.price_cop}
                      onChange={(e) => setCourse({ ...course, price_cop: parseFloat(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Modules */}
                <div className="bg-card rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Módulos y Lecciones</h2>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Módulo
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module) => (
                        <div key={module.id} className="border rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleModule(module.id)}
                            className="w-full p-4 hover:bg-muted flex items-center justify-between"
                          >
                            <div className="text-left">
                              <h3 className="font-semibold">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons?.length || 0} lecciones
                              </p>
                            </div>
                            {expandedModules.includes(module.id) ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>

                          {expandedModules.includes(module.id) && (
                            <div className="border-t bg-muted/50 p-4 space-y-2">
                              {module.lessons && module.lessons.length > 0 ? (
                                module.lessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center justify-between bg-background p-3 rounded">
                                    <div>
                                      <p className="font-sm">{lesson.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {lesson.duration_minutes} min
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="gap-1">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground text-center py-2">
                                  Sin lecciones
                                </p>
                              )}
                              <Button variant="outline" size="sm" className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                Agregar Lección
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          No hay módulos. Crea uno para empezar.
                        </p>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Agregar Módulo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
