'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { fetchProducts, getInstructorRequests, approveInstructor, rejectInstructor, getAllUsersAdmin } from '@/lib/api'
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  category: string
  price_cop: number
  stock_quantity: number
  is_available: boolean
}

interface InstructorRequest {
  id: number
  email: string
  full_name: string
  instructor_request_date: string
}

interface User {
  id: number
  email: string
  full_name: string
  is_admin: boolean
  created_at: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  is_instructor?: boolean
  instructor_approved?: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const { user, logout, isLoggedIn, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [instructorRequests, setInstructorRequests] = useState<InstructorRequest[]>([])
  const [instructorsLoading, setInstructorsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  // Verificar si es admin
  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !user?.is_admin)) {
      router.push('/auth/login')
    }
  }, [isLoggedIn, isLoading, user, router])

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true)
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setProductsLoading(false)
      }
    }

    const loadInstructorRequests = async () => {
      try {
        setInstructorsLoading(true)
        const data = await getInstructorRequests()
        setInstructorRequests(data)
      } catch (error) {
        console.error('Error loading instructor requests:', error)
      } finally {
        setInstructorsLoading(false)
      }
    }

    const loadUsers = async () => {
      try {
        setUsersLoading(true)
        const data = await getAllUsersAdmin()
        setUsers(data)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setUsersLoading(false)
      }
    }

    if (isLoggedIn && user?.is_admin) {
      loadProducts()
      loadInstructorRequests()
      loadUsers()
    }
  }, [isLoggedIn, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user?.is_admin) {
    return null
  }

  const deleteProduct = (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Admin Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b">
            <div>
              <h1 className="text-4xl font-bold">🔧 Panel de Administrador</h1>
              <p className="text-muted-foreground mt-2">Gestiona la plataforma POWERWOMAN</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="h-4 w-4" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('instructors')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'instructors'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Solicitudes Instructoras
              {instructorRequests.length > 0 && (
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {instructorRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="h-4 w-4" />
              Configuración
            </button>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Productos Activos</span>
                    <Package className="h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{products.filter(p => p.is_available).length}</p>
                  <p className="text-xs text-muted-foreground mt-2">Productos disponibles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Stock Total</span>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {products.reduce((sum, p) => sum + p.stock_quantity, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Unidades en inventario</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Ingresos Potenciales</span>
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ${(products.reduce((sum, p) => sum + (p.price_cop * p.stock_quantity), 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Valor del inventario</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Categorías</span>
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {new Set(products.map(p => p.category)).size}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Categorías registradas</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestión de Productos</h2>
                <Button asChild className="gap-2">
                  <Link href="/admin/create">
                    <Plus className="h-4 w-4" />
                    Nuevo Producto
                  </Link>
                </Button>
              </div>

              {productsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando productos...</p>
                </div>
              ) : products.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No hay productos registrados</p>
                    <Button asChild>
                      <Link href="/admin/create">Crear Primer Producto</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold">Producto</th>
                        <th className="text-left px-6 py-4 font-semibold">Categoría</th>
                        <th className="text-right px-6 py-4 font-semibold">Precio</th>
                        <th className="text-right px-6 py-4 font-semibold">Stock</th>
                        <th className="text-center px-6 py-4 font-semibold">Estado</th>
                        <th className="text-center px-6 py-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50 transition">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold">
                            ${product.price_cop.toLocaleString('es-CO')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={product.stock_quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {product.is_available ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                ✗ Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                asChild 
                                variant="outline" 
                                size="sm"
                              >
                                <Link href={`/admin/edit/${product.id}`}>
                                  <Edit2 className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>

              {usersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando usuarios...</p>
                </div>
              ) : users.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No hay usuarios registrados</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold">Nombre</th>
                        <th className="text-left px-6 py-4 font-semibold">Email</th>
                        <th className="text-center px-6 py-4 font-semibold">Admin</th>
                        <th className="text-center px-6 py-4 font-semibold">Instructora</th>
                        <th className="text-left px-6 py-4 font-semibold">Teléfono</th>
                        <th className="text-left px-6 py-4 font-semibold">Ciudad</th>
                        <th className="text-left px-6 py-4 font-semibold">Se Unió</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-muted/50 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold">{u.full_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">{u.email}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {u.is_admin ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                ⚙️ Admin
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {u.is_instructor && u.instructor_approved ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                📚 Aprobada
                              </span>
                            ) : u.is_instructor ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⏳ Pendiente
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">{u.phone || '-'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">{u.city || '-'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString('es-CO')}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* INSTRUCTOR REQUESTS TAB */}
          {activeTab === 'instructors' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Solicitudes de Instructoras</h2>

              {instructorsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando solicitudes...</p>
                </div>
              ) : instructorRequests.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No hay solicitudes pendientes</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {instructorRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{request.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Solicitado: {new Date(request.instructor_request_date).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={async () => {
                                try {
                                  await approveInstructor(request.id)
                                  setInstructorRequests(instructorRequests.filter(r => r.id !== request.id))
                                } catch (err) {
                                  console.error('Error approving:', err)
                                }
                              }}
                              className="gap-2"
                              size="sm"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button
                              onClick={async () => {
                                if (confirm('¿Rechazar esta solicitud?')) {
                                  try {
                                    await rejectInstructor(request.id)
                                    setInstructorRequests(instructorRequests.filter(r => r.id !== request.id))
                                  } catch (err) {
                                    console.error('Error rejecting:', err)
                                  }
                                }
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              Rechazar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>Ajustes generales de la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Funcionalidad en desarrollo</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
