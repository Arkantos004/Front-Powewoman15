"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative w-full bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight text-balance">
              Descubre tu poder a través del maquillaje
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Aprende técnicas profesionales, conecta con nuestra comunidad y encuentra los mejores productos para realzar tu belleza natural.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explorar Cursos
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Ver Video
              </Button>
            </div>
          </div>

          {/* Hero Image/Video */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop"
                alt="Maquillaje profesional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/10" />
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-card/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 lg:h-8 lg:w-8 text-primary ml-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
