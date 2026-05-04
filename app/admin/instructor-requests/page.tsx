'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/use-auth'
import { getInstructorRequests, approveInstructor, rejectInstructor } from '@/lib/api'
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface InstructorRequest {
  id: number
  email: string
  full_name: string
  instructor_request_date: string
  expertise_areas?: string
  portfolio_url?: string
  years_experience?: number
}

export default function InstructorRequestsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [requests, setRequests] = useState<InstructorRequest[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState<number | null>(null)
  const [rejecting, setRejecting] = useState<number | null>(null)

  // Verificar que sea admin
  useEffect(() => {
    if (!isLoading && (!user || !user.is_admin)) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Cargar solicitudes
  useEffect(() => {
    if (user?.is_admin) {
      loadRequests()
    }
  }, [user])

  const loadRequests = async () => {
    try {
      setIsLoadingRequests(true)
      setError(null)
      const response = await getInstructorRequests()
      if (response.success && response.data) {
        setRequests(response.data)
      } else {
        setError(response.error || 'Error al cargar solicitudes')
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes')
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const handleApprove = async (userId: number) => {
    setApproving(userId)
    try {
      const response = await approveInstructor(userId)
      if (response.success) {
        setRequests(requests.filter(r => r.id !== userId))
      } else {
        setError(response.error || 'Error al aprobar solicitud')
      }
    } catch (err: any) {
      setError(err.message || 'Error al aprobar solicitud')
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (userId: number) => {
    setRejecting(userId)
    try {
      const response = await rejectInstructor(userId)
      if (response.success) {
        setRequests(requests.filter(r => r.id !== userId))
      } else {
        setError(response.error || 'Error al rechazar solicitud')
      }
    } catch (err: any) {
      setError(err.message || 'Error al rechazar solicitud')
    } finally {
      setRejecting(null)
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

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes permisos para acceder a esta página
            </AlertDescription>
          </Alert>
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
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Solicitudes de Instructoras</h1>
              <p className="text-muted-foreground">
                Revisa y aprueba las solicitudes de nuevas instructoras
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Content */}
            {isLoadingRequests ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Cargando solicitudes...</p>
              </div>
            ) : requests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin solicitudes pendientes</h3>
                  <p className="text-muted-foreground">
                    No hay solicitudes de instructoras pendientes de revisar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.full_name}</CardTitle>
                          <CardDescription>{request.email}</CardDescription>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.instructor_request_date && (
                            new Date(request.instructor_request_date).toLocaleDateString('es-CO')
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Expertise */}
                      {request.expertise_areas && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Áreas de Expertise</h4>
                          <p className="text-sm text-muted-foreground">
                            {request.expertise_areas}
                          </p>
                        </div>
                      )}

                      {/* Experiencia */}
                      {request.years_experience !== undefined && request.years_experience !== null && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Años de Experiencia</h4>
                          <p className="text-sm text-muted-foreground">
                            {request.years_experience} años
                          </p>
                        </div>
                      )}

                      {/* Portfolio */}
                      {request.portfolio_url && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Portfolio</h4>
                          <a
                            href={request.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {request.portfolio_url}
                          </a>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={approving === request.id || rejecting === request.id}
                          className="flex-1 gap-2"
                        >
                          {approving === request.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {approving === request.id ? 'Aprobando...' : 'Aprobar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          disabled={approving === request.id || rejecting === request.id}
                          className="flex-1 gap-2"
                        >
                          {rejecting === request.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {rejecting === request.id ? 'Rechazando...' : 'Rechazar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Back Link */}
            <div className="mt-8">
              <Link href="/admin">
                <Button variant="outline">Volver al Admin</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
