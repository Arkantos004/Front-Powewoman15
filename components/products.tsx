"use client"

import { useRef } from "react"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Paleta de Sombras Sunset",
    description: "12 tonos cálidos perfectos",
    price: 78000,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Base Fluida Perfecta",
    description: "Cobertura media, acabado natural",
    price: 65000,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Set de Brochas Pro",
    description: "15 brochas profesionales",
    price: 95000,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Labial Mate Duradero",
    description: "Disponible en 24 tonos",
    price: 32000,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    name: "Iluminador en Polvo",
    description: "Brillo natural y sofisticado",
    price: 45000,
    image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Sérum Vitamina C",
    description: "Concentrado antioxidante",
    price: 78000,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
  },
  {
    id: 7,
    name: "Mascarilla Peel-off",
    description: "Limpieza profunda purificante",
    price: 38000,
    image: "https://images.unsplash.com/photo-1473093295203-cad00010cb2b?w=400&h=400&fit=crop"
  },
  {
    id: 8,
    name: "Corrector de Ojeras",
    description: "Cobertura perfecta y duradera",
    price: 35000,
    image: "https://images.unsplash.com/photo-1512207736139-6c1dcc1d34fe?w=400&h=400&fit=crop"
  }
]

export function Products() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section id="productos" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Productos</h2>
            <p className="mt-2 text-muted-foreground">Los favoritos de nuestra tienda</p>
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

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[240px] lg:w-[280px] group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                <p className="text-lg font-bold mt-2 text-primary">${product.price.toLocaleString('es-CO')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile scroll buttons */}
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
