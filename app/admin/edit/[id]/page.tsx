'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { fetchProducts, updateProduct, uploadImage } from '@/lib/api'

interface Product {
  id: number
  name: string
  description: string
  category: string
  price_cop: number
  image_url?: string
  stock_quantity: number
  is_available: boolean
}

const categories = [
  'Maquillaje',
  'Skincare',
  'Masajes',
  'Accesorios',
  'Belleza Natural',
  'Herramientas',
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = parseInt(params.id as string)

  const [formData, setFormData] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const products = await fetchProducts()
        const product = products.find((p: any) => p.id === productId)
        if (product) {
          setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price_cop: product.price_cop,
            image_url: product.image_url,
            stock_quantity: product.stock_quantity,
            is_available: product.is_available,
          })
        } else {
          setError('Producto no encontrado')
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el producto')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError(null)
    setIsSubmitting(true)

    if (!formData.name || !formData.description || !formData.price_cop) {
      setError('Por favor complete los campos requeridos')
      setIsSubmitting(false)
      return
    }

    try {
      await updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price_cop: formData.price_cop,
        image_url: formData.image_url,
        stock_quantity: formData.stock_quantity,
        is_available: formData.is_available,
      })

      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Producto no encontrado</p>
            <Link href="/admin">
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
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Editar Producto</h1>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 space-y-6">
              {/* Image Upload */}
              <div>
                <Label htmlFor="imageUpload" className="text-base font-semibold mb-2 block">
                  Imagen del Producto (Opcional)
                </Label>
                <div className="space-y-3">
                  {/* Current Image Preview */}
                  {formData.image_url && (formData.image_url.startsWith('http') || formData.image_url.startsWith('/uploads/')) && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Sube una imagen para cambiarla:</label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            const result = await uploadImage(file)
                            setFormData({ ...formData, image_url: result.url })
                            setError(null)
                          } catch (err: any) {
                            setError(`Error al subir imagen: ${err.message}`)
                          }
                        }
                      }}
                      className="block text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-base font-semibold mb-2 block">
                  Nombre del Producto *
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Paleta de Sombras Premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-base"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                  Descripción *
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe los detalles del producto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={4}
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-base font-semibold mb-2 block">
                  Categoría *
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-semibold mb-2 block">
                  Precio (COP) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Ej: 50000"
                  value={formData.price_cop}
                  onChange={(e) => setFormData({ ...formData, price_cop: parseFloat(e.target.value) })}
                  className="text-base"
                  step="0.01"
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <Label htmlFor="stock" className="text-base font-semibold mb-2 block">
                  Cantidad en Stock *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Ej: 100"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  className="text-base"
                />
              </div>

              {/* Is Available */}
              <div>
                <Label htmlFor="available" className="text-base font-semibold mb-2 block">
                  Disponibilidad
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="available" className="text-sm">
                    {formData.is_available ? '✓ Disponible' : '✗ No disponible'}
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Link href="/admin" className="flex-1">
                  <Button variant="outline" className="w-full" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
