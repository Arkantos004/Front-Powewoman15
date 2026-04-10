'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  image: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
      return
    }

    setIsAuthenticated(true)

    // Cargar productos desde localStorage
    const stored = localStorage.getItem('adminProducts')
    if (stored) {
      setProducts(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [router])

  const deleteProduct = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      localStorage.setItem('adminProducts', JSON.stringify(updated))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/')
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Admin Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold">Panel de Administrador</h1>
                <p className="text-muted-foreground mt-2">Gestiona los productos del negocio</p>
              </div>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>

            {/* Add Product Button */}
            <div className="mb-8">
              <Link href="/admin/create">
                <Button className="gap-2" size="lg">
                  <Plus className="h-5 w-5" />
                  Agregar Nuevo Producto
                </Button>
              </Link>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-lg overflow-hidden">
              {products.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground text-lg mb-4">No hay productos registrados</p>
                  <p className="text-muted-foreground text-sm">
                    Haz clic en "Agregar Nuevo Producto" para comenzar
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold">Producto</th>
                        <th className="text-left px-6 py-4 font-semibold">Categoría</th>
                        <th className="text-right px-6 py-4 font-semibold">Precio</th>
                        <th className="text-center px-6 py-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.description.substring(0, 40)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold">
                            ${product.price.toLocaleString('es-CO')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link href={`/admin/edit/${product.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Editar
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
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

            {/* Stats */}
            {products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-card rounded-lg p-6">
                  <p className="text-muted-foreground text-sm">Total de Productos</p>
                  <p className="text-3xl font-bold mt-2">{products.length}</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <p className="text-muted-foreground text-sm">Valor Total del Inventario</p>
                  <p className="text-3xl font-bold mt-2">
                    ${products.reduce((sum, p) => sum + p.price, 0).toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <p className="text-muted-foreground text-sm">Precio Promedio</p>
                  <p className="text-3xl font-bold mt-2">
                    ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
