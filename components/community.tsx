"use client"

import { Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "María García",
    role: "Maquilladora Profesional",
    content: "Los cursos de POWERWOMAN transformaron mi carrera. Las técnicas que aprendí me permitieron trabajar con grandes marcas.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    type: "Comentarios"
  },
  {
    id: 2,
    name: "Ana Rodríguez",
    role: "Estudiante",
    content: "Increíble experiencia de aprendizaje. La comunidad es muy solidaria y los instructores explican todo con mucha claridad.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    type: "Experiencias"
  },
  {
    id: 3,
    name: "Laura Martínez",
    role: "Emprendedora",
    content: "Gracias a los cursos pude empezar mi propio negocio de maquillaje. La inversión vale completamente la pena.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    type: "Comentarios"
  }
]

export function Community() {
  return (
    <section id="comunidad" className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold">Nuestra Comunidad</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Únete a miles de mujeres que están descubriendo su poder a través del maquillaje
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <Quote className="h-6 w-6 text-primary/30" />
              </div>
              <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
              <span className="inline-block mt-4 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                {testimonial.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
