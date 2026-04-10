'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload } from 'lucide-react'

const categories = [
  'Maquillaje',
  'Skincare',
  'Masajes',
  'Accesorios',
  'Belleza Natural',
  'Herramientas',
]

export default function CreateProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Maquillaje',
    price: '',
    image: '',
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFormData({ ...formData, image: result })
        setPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      alert('Por favor complete todos los campos')
      setIsSubmitting(false)
      return
    }

    // Obtener productos existentes
    const stored = localStorage.getItem('adminProducts')
    const products = stored ? JSON.parse(stored) : []

    // Crear nuevo producto
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseInt(formData.price),
      image: formData.image,
    }

    // Guardar
    const updated = [...products, newProduct]
    localStorage.setItem('adminProducts', JSON.stringify(updated))

    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/admin')
    }, 500)
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
              <h1 className="text-4xl font-bold">Agregar Producto</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Imagen del Producto</Label>
                <div className="relative">
                  {preview ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null)
                          setFormData({ ...formData, image: '' })
                        }}
                        className="absolute top-2 right-2 bg-destructive text-white p-2 rounded hover:bg-destructive/80"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition">
                      <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                      <span className="text-center">
                        <span className="font-semibold text-primary">Haz clic para subir</span>
                        <span className="text-muted-foreground"> o arrastra una imagen</span>
                      </span>
                      <span className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
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
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="text-base"
                />
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
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
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
