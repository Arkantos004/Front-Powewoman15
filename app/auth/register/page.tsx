'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { register } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validación
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor complete todos los campos')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      // Llamar a la API de registro
      const response = await register(formData.email, formData.name, formData.password)
      
      if (response.data?.token) {
        // Guardar token en localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user || { email: formData.email, full_name: formData.name }))
        
        // Mostrar mensaje de éxito
        setSuccess('✅ ¡Registro exitoso! Redirigiendo al carrito...')
        console.log('🎉 Usuario registrado:', response.data.user)
        
        // Redirigir al checkout después de 1.5 segundos
        setTimeout(() => {
          router.push('/checkout')
        }, 1500)
      } else {
        setError('Ha ocurrido un error en el registro')
      }
    } catch (err: any) {
      console.error('❌ Error de registro:', err)
      setError(err.message || 'Error al registrarse. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          {/* Card */}
          <div className="bg-card rounded-lg p-8 shadow-lg">
            {/* Header */}
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>

            <h1 className="text-3xl font-bold mb-2">Crea tu Cuenta</h1>
            <p className="text-muted-foreground mb-8">Únete a POWERWOMAN hoy</p>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm font-semibold">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Contraseña
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">O</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
