'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { fetchProducts } from '@/lib/api'

const categories = [
  { id: 1, name: 'Maquillaje', icon: '💄' },
  { id: 2, name: 'Skincare', icon: '✨' },
  { id: 3, name: 'Masajes', icon: '💆' },
  { id: 4, name: 'Accesorios', icon: '👜' },
  { id: 5, name: 'Belleza Natural', icon: '🌿' },
  { id: 6, name: 'Herramientas', icon: '🛠️' },
]

const defaultProducts = [
  // Maquillaje
  { id: 1, name: 'Paleta de Sombras Profesional 24 Colores', category: 'Maquillaje', price: 89000, image: '💄' },
  { id: 2, name: 'Base Líquida Premium SPF 30', category: 'Maquillaje', price: 65000, image: '💄' },
  { id: 3, name: 'Labial Mate de Larga Duración', category: 'Maquillaje', price: 32000, image: '💄' },
  { id: 4, name: 'Rubor Compacto Luminoso', category: 'Maquillaje', price: 28000, image: '💄' },
  { id: 5, name: 'Delineador Líquido Precisión', category: 'Maquillaje', price: 22000, image: '💄' },
  { id: 6, name: 'Mascara Volumen Máximo', category: 'Maquillaje', price: 35000, image: '💄' },

  // Skincare
  { id: 7, name: 'Sérum Vitamina C Concentrado', category: 'Skincare', price: 78000, image: '✨' },
  { id: 8, name: 'Crema Hidratante Noche Intensiva', category: 'Skincare', price: 62000, image: '✨' },
  { id: 9, name: 'Tónico Limpiador Facial', category: 'Skincare', price: 45000, image: '✨' },
  { id: 10, name: 'Mascarilla Peel-off Purificante', category: 'Skincare', price: 38000, image: '✨' },
  { id: 11, name: 'Contorno de Ojos Anti-Arrugas', category: 'Skincare', price: 55000, image: '✨' },
  { id: 12, name: 'Bloqueador Solar SPF 50+', category: 'Skincare', price: 51000, image: '✨' },

  // Masajes
  { id: 13, name: 'Aceite de Masaje Relajante 250ml', category: 'Masajes', price: 34000, image: '💆' },
  { id: 14, name: 'Rodillo Masajeador de Jade', category: 'Masajes', price: 42000, image: '💆' },
  { id: 15, name: 'Bola Masajeadora de Reflexología', category: 'Masajes', price: 28000, image: '💆' },
  { id: 16, name: 'Gel Masaje Deportivo Calentador', category: 'Masajes', price: 32000, image: '💆' },
  { id: 17, name: 'Dispositivo Masajeador Facial Ultrasónico', category: 'Masajes', price: 156000, image: '💆' },
  { id: 18, name: 'Guantes de Masaje Estimulante', category: 'Masajes', price: 21000, image: '💆' },

  // Accesorios
  { id: 19, name: 'Set de Pinceles Profesionales 12pcs', category: 'Accesorios', price: 95000, image: '👜' },
  { id: 20, name: 'Bolsa Organizadora Maquillaje Premium', category: 'Accesorios', price: 68000, image: '👜' },
  { id: 21, name: 'Espejo Iluminado LED Portátil', category: 'Accesorios', price: 72000, image: '👜' },
  { id: 22, name: 'Esponja de Maquillaje Beauty Blender', category: 'Accesorios', price: 24000, image: '👜' },
  { id: 23, name: 'Joyero Organizador Espejo', category: 'Accesorios', price: 58000, image: '👜' },
  { id: 24, name: 'Bandeau Diadema de Aplicación', category: 'Accesorios', price: 15000, image: '👜' },

  // Belleza Natural
  { id: 25, name: 'Aceite de Coco Orgánico Puro', category: 'Belleza Natural', price: 48000, image: '🌿' },
  { id: 26, name: 'Exfoliante Corporal Natural Café', category: 'Belleza Natural', price: 36000, image: '🌿' },
  { id: 27, name: 'Jabón Natural Arcilla Verde', category: 'Belleza Natural', price: 18000, image: '🌿' },
  { id: 28, name: 'Bálsamo Labial Natural Cacao Shea', category: 'Belleza Natural', price: 14000, image: '🌿' },
  { id: 29, name: 'Tónico Floral de Rosa Damasco', category: 'Belleza Natural', price: 42000, image: '🌿' },
  { id: 30, name: 'Crema Corporal Manteca Karite Orgánica', category: 'Belleza Natural', price: 52000, image: '🌿' },

  // Herramientas
  { id: 31, name: 'Rizador de Pestañas Profesional', category: 'Herramientas', price: 32000, image: '🛠️' },
  { id: 32, name: 'Cortaúñas de Precisión Acero Inox', category: 'Herramientas', price: 19000, image: '🛠️' },
  { id: 33, name: 'Secador Inalámbrico Profesional', category: 'Herramientas', price: 185000, image: '🛠️' },
  { id: 34, name: 'Cepillo Ovalado Desemredante', category: 'Herramientas', price: 28000, image: '🛠️' },
  { id: 35, name: 'Plancha Cerámica Control Temperatura', category: 'Herramientas', price: 142000, image: '🛠️' },
  { id: 36, name: 'Lima de Uñas Cristal Profesional', category: 'Herramientas', price: 12000, image: '🛠️' },
]

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState(defaultProducts)
  const [filters, setFilters] = useState({
    availability: false,
    price: false,
    name: false,
  })
  const { addItem } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Intentar cargar productos de la API
        const apiProducts = await fetchProducts()
        
        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          // Mapear productos de la API al formato esperado
          const mappedProducts = apiProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'General',
            price: p.price_cop || p.price || 0,
            image: '💳', // Ícono por defecto, puede ser mejorado
            description: p.description,
          }))
          setProducts(mappedProducts)
        } else {
          // Si la API no devuelve productos, usar los productos por defecto
          setProducts(defaultProducts)
        }
      } catch (error) {
        console.error('Error cargando productos de la API:', error)
        // Fallback a productos por defecto si hay error
        setProducts(defaultProducts)
      }
    }

    loadProducts()
  }, [])

  const handleAddToCart = (product: (typeof defaultProducts)[0]) => {
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
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-card rounded-lg p-4 text-center hover:shadow-lg transition cursor-pointer hover:bg-muted"
                      >
                        <div className="text-4xl mb-2">{cat.icon}</div>
                        <p className="font-semibold text-xs">{cat.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                        {product.image && product.image.startsWith('data:') ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">{product.image}</span>
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
