'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'

// Credenciales demo (en producción usar un backend real)
const ADMIN_EMAIL = 'admin@powerwoman.com'
const ADMIN_PASSWORD = 'admin123'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simular validación
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', 'true')
        router.push('/admin')
      } else {
        setError('Email o contraseña incorrectos')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          {/* Card */}
          <div className="bg-card rounded-lg p-8 shadow-lg">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-7 w-7 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-2">Panel Administrador</h1>
            <p className="text-center text-muted-foreground mb-8">
              Ingresa tus credenciales para acceder
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@powerwoman.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Validando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold mb-2">Credenciales Demo:</p>
              <p className="text-muted-foreground">
                <strong>Email:</strong> {ADMIN_EMAIL}
              </p>
              <p className="text-muted-foreground">
                <strong>Contraseña:</strong> {ADMIN_PASSWORD}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
