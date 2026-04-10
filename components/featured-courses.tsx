"use client"

import { useRef } from "react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const courses = [
  {
    id: 1,
    title: "Maquillaje Natural",
    category: "Básico",
    duration: "2h 30min",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Perfeccionamiento",
    category: "Avanzado",
    duration: "4h 15min",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Técnicas de Resumen",
    category: "Intermedio",
    duration: "3h 00min",
    image: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Maquillaje Artístico",
    category: "Especialización",
    duration: "5h 45min",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Contouring Profesional",
    category: "Avanzado",
    duration: "3h 30min",
    image: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=400&h=300&fit=crop"
  }
]

export function FeaturedCourses() {
  const scrollRef = useRef<HTMLDivElement>(null)

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
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex-shrink-0 w-[280px] lg:w-[300px] group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img
                  src={course.image}
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
                  {course.category}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{course.duration}</p>
              </div>
            </div>
          ))}
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
