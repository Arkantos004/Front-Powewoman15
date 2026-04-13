'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit3, 
  LogOut, 
  BookOpen, 
  ShoppingBag,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isLoggedIn, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Mis Cursos
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'purchases'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Mis Compras
            </button>
          </div>

          {/* PANEL 1: MI PERFIL */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Header Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <Button asChild variant="outline">
                      <Link href="/profile/edit">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Instructor Status */}
              {user.is_instructor ? (
                <Card className={user.instructor_approved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {user.instructor_approved ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span>Instructora Aprobada</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <span>Solicitud de Instructora Pendiente</span>
                        </>
                      )}
                    </CardTitle>
                    {user.instructor_approved && (
                      <CardDescription>Acceso completo al panel de instructora</CardDescription>
                    )}
                  </CardHeader>
                  {user.instructor_approved && (
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link href="/instructor">📚 Ir al Panel de Instructora</Link>
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conviértete en Instructora</CardTitle>
                    <CardDescription>Comparte tu conocimiento y gana dinero enseñando</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Como instructora podrás crear cursos, módulos y lecciones para compartir tu expertise con nuestra comunidad.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/profile/request-instructor">Solicitar Ser Instructora</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="font-medium mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </label>
                      <p className="font-medium mt-1">{user.phone || 'No proporcionado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de Dirección</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Dirección
                      </label>
                      <p className="font-medium mt-1">{user.address || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Ciudad
                      </label>
                      <p className="font-medium mt-1">{user.city || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        País
                      </label>
                      <p className="font-medium mt-1">{user.country || 'No proporcionado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Código Postal</label>
                      <p className="font-medium mt-1">{user.postal_code || 'No proporcionado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logout */}
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}

          {/* PANEL 2: MIS CURSOS */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Cursos</CardTitle>
                  <CardDescription>Cursos en los que estás inscrito</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Curso 1 */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Maquillaje Natural & Profesional</h3>
                          <p className="text-sm text-muted-foreground mt-1">Aprende técnicas profesionales de maquillaje</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Iniciado: 15 Enero 2024
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm font-medium">75%</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Continuar <ArrowRight className="h-4 w-4 ml-2" /></Button>
                      </div>
                    </div>

                    {/* Curso 2 */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Técnicas Avanzadas de Contouring</h3>
                          <p className="text-sm text-muted-foreground mt-1">Domina el contouring profesional</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Iniciado: 01 Febrero 2024
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                              </div>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Continuar <ArrowRight className="h-4 w-4 ml-2" /></Button>
                      </div>
                    </div>

                    {/* Curso 3 - Completado */}
                    <div className="border rounded-lg p-4 bg-green-50 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Introducción al Maquillaje</h3>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Conceptos básicos de maquillaje</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Completado: 20 Enero 2024
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-green-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600" style={{ width: '100%' }}></div>
                              </div>
                              <span className="text-sm font-medium text-green-600">100%</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Certificado</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PANEL 3: MIS COMPRAS */}
          {activeTab === 'purchases' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Compras</CardTitle>
                  <CardDescription>Historial de compras y transacciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Compra 1 */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">Pedido #PW-2024-001</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completado
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">2 productos</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Maquillaje Pro Bundle</span>
                              <span className="font-medium">$150,000</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Pinceles Premium Set</span>
                              <span className="font-medium">$85,000</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2 mt-2">
                              <span className="font-semibold">Total</span>
                              <span className="font-semibold text-lg">$235,000</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            15 Enero 2024
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">Detalles</Button>
                          <Button size="sm" variant="ghost">Factura</Button>
                        </div>
                      </div>
                    </div>

                    {/* Compra 2 */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">Pedido #PW-2024-002</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              En tránsito
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">1 producto</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Curso: Técnicas Avanzadas</span>
                              <span className="font-medium">$89,000</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2 mt-2">
                              <span className="font-semibold">Total</span>
                              <span className="font-semibold text-lg">$89,000</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            20 Enero 2024
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">Rastrear</Button>
                          <Button size="sm" variant="ghost">Factura</Button>
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold">$324,000</p>
                        <p className="text-sm text-muted-foreground">Gasto Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-sm text-muted-foreground">Pedidos Completados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">1</p>
                        <p className="text-sm text-muted-foreground">En Tránsito</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
