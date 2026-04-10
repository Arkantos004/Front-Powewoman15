'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ChevronDown, Mail, Phone, LogOut } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
}

const userCourses = [
  { id: 1, title: 'Maquillaje Natural', progress: 75 },
  { id: 2, title: 'Técnicas Avanzadas', progress: 40 },
]

const purchases = [
  { id: 1, name: 'Compra #001', date: '2024-01-15', amount: '$250,000' },
  { id: 2, name: 'Compra #002', date: '2024-01-20', amount: '$180,000' },
]

export default function ProfilePage() {
  const [expandMyCourses, setExpandMyCourses] = useState(false)
  const [expandMyPurchases, setExpandMyPurchases] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(storedUser))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Mi Perfil</h1>

            {/* User Info */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">👤</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/profile/edit" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Editar Perfil
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-card rounded-lg p-6 mb-6">
              <button
                onClick={() => setExpandMyCourses(!expandMyCourses)}
                className="w-full flex items-center justify-between font-bold mb-6 text-lg"
              >
                <span>Mis Cursos</span>
                <ChevronDown
                  className="h-5 w-5 transition-transform"
                  style={{
                    transform: expandMyCourses ? 'rotate(0deg)' : 'rotate(-90deg)',
                  }}
                />
              </button>

              {expandMyCourses && (
                <div className="space-y-4">
                  {userCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Purchases */}
            <div className="bg-card rounded-lg p-6">
              <button
                onClick={() => setExpandMyPurchases(!expandMyPurchases)}
                className="w-full flex items-center justify-between font-bold mb-6 text-lg"
              >
                <span>Mis Compras</span>
                <ChevronDown
                  className="h-5 w-5 transition-transform"
                  style={{
                    transform: expandMyPurchases ? 'rotate(0deg)' : 'rotate(-90deg)',
                  }}
                />
              </button>

              {expandMyPurchases && (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="border rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold">{purchase.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {purchase.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{purchase.amount}</p>
                        <Button variant="outline" size="sm">
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
