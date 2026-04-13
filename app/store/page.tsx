'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search, Palette, Sparkles, Hand, ShoppingBag, Leaf, Wrench, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { fetchProducts } from '@/lib/api'

const categories = [
  { id: 1, name: 'Maquillaje', icon: Palette },
  { id: 2, name: 'Skincare', icon: Sparkles },
  { id: 3, name: 'Masajes', icon: Hand },
  { id: 4, name: 'Accesorios', icon: ShoppingBag },
  { id: 5, name: 'Belleza Natural', icon: Leaf },
  { id: 6, name: 'Herramientas', icon: Wrench },
]

interface Product {
  id: number
  name: string
  category: string
  price: number
  image?: string
  description?: string
}

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    availability: false,
    price: false,
    name: false,
  })
  const { addItem } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const apiProducts = await fetchProducts()
        
        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          const mappedProducts = apiProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'General',
            price: p.price_cop || p.price || 0,
            image: p.image_url || null,
            description: p.description,
          }))
          setProducts(mappedProducts)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Error cargando productos de la API:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Tienda</h1>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold mb-6">Filtros</h2>
                <div className="space-y-4 bg-card p-4 rounded-lg sticky top-24">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="availability"
                      checked={filters.availability}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, availability: !!checked })
                      }
                    />
                    <Label htmlFor="availability" className="cursor-pointer">
                      Disponibilidad
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="price"
                      checked={filters.price}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, price: !!checked })
                      }
                    />
                    <Label htmlFor="price" className="cursor-pointer">
                      Precio
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="name"
                      checked={filters.name}
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, name: !!checked })
                      }
                    />
                    <Label htmlFor="name" className="cursor-pointer">
                      Nombre
                    </Label>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="lg:col-span-3">
                {/* Search */}
                <div className="mb-8">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
                    {categories.map((cat) => {
                      const IconComponent = cat.icon
                      return (
                        <div
                          key={cat.id}
                          className="bg-card rounded-lg p-4 text-center hover:shadow-lg transition cursor-pointer hover:bg-muted"
                        >
                          <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="font-semibold text-xs">{cat.name}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                  <div className="text-center py-12 col-span-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando productos...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground mb-4">No hay productos disponibles en este momento</p>
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      Limpiar búsqueda
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                          {product.image && (product.image.startsWith('http') || product.image.startsWith('/uploads/')) ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-16 w-16 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-1 text-sm line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-primary mb-3">
                            ${product.price.toLocaleString('es-CO')}
                          </p>
                          <Button className="w-full" size="sm" onClick={() => handleAddToCart(product)}>
                            Agregar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
