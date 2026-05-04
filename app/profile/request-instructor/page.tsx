'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { requestInstructor } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

export default function RequestInstructorPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    expertise_areas: '',
    portfolio_url: '',
    years_experience: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const yearsExp = formData.years_experience ? parseInt(formData.years_experience) : undefined

      const response = await requestInstructor({
        expertise_areas: formData.expertise_areas || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        years_experience: yearsExp,
      })

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        setError(response.error || 'Error al enviar solicitud')
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 max-w-2xl py-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold">¡Solicitud Enviada!</h1>
              <p className="text-lg text-muted-foreground">
                Hemos recibido tu solicitud para ser instructora. 
                <br />
                El equipo de admin la revisará pronto.
              </p>
              <p className="text-sm text-muted-foreground">
                Te notificaremos mediante email cuando tu solicitud haya sido aprobada.
              </p>
              <Button asChild className="gap-2">
                <Link href="/profile">Volver al Perfil</Link>
              </Button>
            </div>
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
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Solicitar Ser Instructora</h1>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                {error}
              </div>
            )}

            {/* Content */}
            <div className="space-y-6">
              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Beneficios de ser Instructora</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Crea tus propios cursos</h3>
                        <p className="text-sm text-muted-foreground">
                          Diseña contenido con módulos, lecciones y videos
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Monetiza tu conocimiento</h3>
                        <p className="text-sm text-muted-foreground">
                          Define el precio de tus cursos y gana dinero
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Acceso completo al panel</h3>
                        <p className="text-sm text-muted-foreground">
                          Gestiona módulos, lecciones y seguimiento de estudiantes
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Alcanza a miles de estudiantes</h3>
                        <p className="text-sm text-muted-foreground">
                          Comparte tu expertise con nuestra comunidad global
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Ser un usuario registrado de POWERWOMAN</p>
                  <p>✓ Proporcionar información profesional veraz</p>
                  <p>✓ Cumplir con los términos de servicio</p>
                  <p>✓ Aprobación del equipo administrativo</p>
                </CardContent>
              </Card>

              {/* Solicitud Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Profesional</CardTitle>
                  <CardDescription>Completa los siguientes datos para tu solicitud</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequest} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="mt-1 text-foreground font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nombre Completo</label>
                      <p className="mt-1 text-foreground font-medium">{user?.full_name}</p>
                    </div>

                    {/* Áreas de Expertise */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Áreas de Expertise *
                      </label>
                      <Textarea
                        name="expertise_areas"
                        placeholder="Ej: Maquillaje profesional, Diseño de cejas, Cuidado de la piel, etc."
                        value={formData.expertise_areas}
                        onChange={handleChange}
                        required
                        className="min-h-20"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Describe las áreas en las que tienes experiencia y puedes enseñar
                      </p>
                    </div>

                    {/* Años de Experiencia */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Años de Experiencia
                      </label>
                      <Input
                        type="number"
                        name="years_experience"
                        placeholder="Ej: 5"
                        min="0"
                        value={formData.years_experience}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tu experiencia profesional en la industria (opcional)
                      </p>
                    </div>

                    {/* Portfolio URL */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Portfolio o Web
                      </label>
                      <Input
                        type="url"
                        name="portfolio_url"
                        placeholder="https://..."
                        value={formData.portfolio_url}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Link a tu portafolio, Instagram, LinkedIn o sitio web (opcional)
                      </p>
                    </div>

                    {/* Términos */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-foreground">
                        ✓ Aceptas nuestros términos de instructora<br />
                        ✓ Tu solicitud será revisada por el equipo de admin<br />
                        ✓ Recibirás una respuesta en máximo 5 días hábiles
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Link href="/profile" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Cancelar
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 gap-2"
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
