'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.fullName && formData.email && formData.password && formData.userType) {
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      setError('Por favor completa todos los campos')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="font-serif text-3xl font-bold">POWERWOMAN</h1>
            <p className="text-sm text-muted-foreground mt-1">Empodera tu talento</p>
          </div>
          <CardTitle>Crear Cuenta</CardTitle>
          <CardDescription>
            Únete a nuestra comunidad de mujeres empoderadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Select
                value={formData.userType}
                onValueChange={(value) =>
                  setFormData({ ...formData, userType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="professional">Profesional</SelectItem>
                  <SelectItem value="entrepreneur">Emprendedora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link href="/auth/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
