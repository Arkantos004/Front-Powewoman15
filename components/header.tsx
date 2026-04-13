"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, User, ShoppingCart, X, LogOut, Home, CheckCircle2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isLoggedIn, user, logout, isLoading } = useAuth()
  const { getTotalQuantity } = useCart()
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setCartCount(getTotalQuantity())
  }, [getTotalQuantity])

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-background">
            <nav className="flex flex-col gap-6 pt-8">
              <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/courses" className="text-lg font-medium hover:text-primary transition-colors">
                Cursos
              </Link>
              <Link href="/community" className="text-lg font-medium hover:text-primary transition-colors">
                Comunidad
              </Link>
              <Link href="/store" className="text-lg font-medium hover:text-primary transition-colors">
                Tienda
              </Link>
              <Link href="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                Perfil
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
            Cursos
          </Link>
          <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
            Comunidad
          </Link>
          <Link href="/store" className="text-sm font-medium hover:text-primary transition-colors">
            Tienda
          </Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            POWERWOMAN
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-32 lg:w-48 px-3 py-1.5 text-sm bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
                <span className="sr-only">Mi cuenta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isLoggedIn && user ? (
                <>
                  <div className="px-2 py-1.5 border-b">
                    <p className="text-sm font-bold text-primary">✅ SESIÓN ACTIVA</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                    <p className="text-sm font-semibold mt-2">¡Hola, {user.full_name}!</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">👤 Mi Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=courses">📚 Mis Cursos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=orders">🛍️ Mis Compras</Link>
                  </DropdownMenuItem>
                  {user.is_instructor && user.instructor_approved && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/instructor" className="font-semibold text-blue-600">📚 Panel de Instructora</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.is_admin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="font-semibold text-amber-600">⚙️ Panel de Admin</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <div className="px-2 py-1.5 border-b">
                    <p className="text-xs text-muted-foreground">No estás logueado</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">Registrarse</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/checkout" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
