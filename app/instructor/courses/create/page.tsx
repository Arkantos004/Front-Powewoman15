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
import { createCourse, uploadImage } from '@/lib/api'

export default function CreateCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    price_cop: '0',
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mostrar preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      try {
        // Subir imagen a la API
        setError(null)
        const result = await uploadImage(file)
        setFormData({ ...formData, image_url: result.url })
      } catch (err: any) {
        setError(`Error al subir imagen: ${err.message}`)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!formData.title || !formData.description) {
      setError('Por favor completa el título y descripción')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await createCourse({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || undefined,
        price_cop: parseFloat(formData.price_cop) || 0,
      })

      if (response.data) {
        router.push(`/instructor/courses/${response.data.id}`)
      } else {
        router.push('/instructor')
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el curso')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/instructor">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Crear Nuevo Curso</h1>
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
                <Label className="text-base font-semibold mb-3 block">Imagen del Curso (Opcional)</Label>
                <div className="space-y-4">
                  {/* Preview */}
                  {preview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null)
                          setFormData({ ...formData, image_url: '' })
                        }}
                        className="absolute top-2 right-2 bg-destructive text-white p-2 rounded hover:bg-destructive/80"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-sm text-muted-foreground mb-2">Selecciona una imagen:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-semibold mb-2 block">
                  Título del Curso *
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Introducción al Maquillaje Profesional"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  placeholder="Describe el contenido de tu curso..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={6}
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-base font-semibold mb-2 block">
                  Precio (COP) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={formData.price_cop}
                  onChange={(e) => setFormData({ ...formData, price_cop: e.target.value })}
                  className="text-base"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <Link href="/instructor" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Curso'}
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
