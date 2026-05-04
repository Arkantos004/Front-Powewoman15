"use client"

import { useRef, useState, useEffect } from "react"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchProducts } from "@/lib/api"

export function Products() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

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
          {loading ? (
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground">
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground">
              No hay productos disponibles
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[240px] lg:w-[280px] group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={product.image_url || product.image}
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
                  <p className="text-lg font-bold mt-2 text-primary">${(product.price || product.price_cop || 0).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))
          )}
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
