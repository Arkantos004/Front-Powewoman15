'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Clock, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import { getCourseDetail } from '@/lib/api'

interface Lesson {
  id: number
  title: string
  description?: string
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
  modules?: Module[]
  instructor_name?: string
}

export default function CoursePage() {
  const params = useParams()
  const courseId = parseInt(params.id as string)

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [expandedModules, setExpandedModules] = useState<number[]>([])

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setIsLoading(true)
      const data = await getCourseDetail(courseId)
      setCourse(data)
      
      // Seleccionar primera lección automáticamente
      if (data.modules && data.modules.length > 0 && data.modules[0].lessons && data.modules[0].lessons.length > 0) {
        setSelectedLesson(data.modules[0].lessons[0])
        setExpandedModules([data.modules[0].id])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const getTotalLessons = (modules?: Module[]) => {
    return modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0
  }

  const getTotalDuration = (modules?: Module[]) => {
    return modules?.reduce((acc, m) => 
      acc + (m.lessons?.reduce((x, l) => x + (l.duration_minutes || 0), 0) || 0), 0
    ) || 0
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
            <Link href="/courses">
              <Button>Volver a Cursos</Button>
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
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link href="/courses">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">Por {course.instructor_name}</p>
              </div>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Video Player & Details - 2 cols */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  {selectedLesson?.video_url ? (
                    <iframe
                      src={selectedLesson.video_url}
                      title={selectedLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Video no disponible</p>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                {selectedLesson && (
                  <div className="bg-card rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                    {selectedLesson.description && (
                      <p className="text-muted-foreground">{selectedLesson.description}</p>
                    )}
                    
                    {/* Lesson Duration */}
                    {selectedLesson.duration_minutes && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{selectedLesson.duration_minutes} minutos</span>
                      </div>
                    )}

                    {/* Mark as Complete Button */}
                    <Button className="w-full gap-2 mt-4">
                      <CheckCircle2 className="h-5 w-5" />
                      Marcar como Completado
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar - Modules & Lessons */}
              <div className="lg:col-span-1 space-y-6">
                {/* Course Stats */}
                <div className="bg-card rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Información del Curso</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{getTotalLessons(course.modules)} lecciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{getTotalDuration(course.modules)} minutos totales</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">Progreso</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>

                {/* Modules & Lessons List */}
                <div className="bg-card rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold mb-4">Contenido del Curso</h3>
                  
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => (
                      <div key={module.id} className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className="w-full p-3 hover:bg-muted flex items-center justify-between"
                        >
                          <span className="font-semibold text-sm">{module.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {module.lessons?.length || 0}
                          </span>
                        </button>

                        {expandedModules.includes(module.id) && (
                          <div className="bg-muted/50 space-y-1 p-2">
                            {module.lessons && module.lessons.length > 0 ? (
                              module.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => setSelectedLesson(lesson)}
                                  className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 hover:bg-background transition ${
                                    selectedLesson?.id === lesson.id ? 'bg-background font-semibold' : ''
                                  }`}
                                >
                                  {selectedLesson?.id === lesson.id ? (
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <span className="line-clamp-2">{lesson.title}</span>
                                </button>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground p-2">Sin lecciones</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Sin módulos disponibles
                    </p>
                  )}
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
