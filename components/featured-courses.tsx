"use client"

import { useRef, useState, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchCourses } from "@/lib/api"

export function FeaturedCourses() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section id="cursos" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Cursos Destacados</h2>
            <p className="mt-2 text-muted-foreground">Aprende de las mejores profesionales</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Courses Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground">
              Cargando cursos...
            </div>
          ) : courses.length === 0 ? (
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground">
              No hay cursos disponibles
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-[280px] lg:w-[300px] group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={course.image_url || course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-card/95 flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 text-primary ml-0.5" />
                    </div>
                  </button>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-card/90 text-xs font-medium rounded-full">
                    {course.category || course.level || 'Curso'}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.duration_hours ? `${course.duration_hours}h` : course.duration || 'Duración no especificada'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
