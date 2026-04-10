'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { X, Plus, Minus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/api'

export default function CheckoutPage() {
  const { items: cartItems, updateQuantity, removeItem } = useCart()
  const router = useRouter()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const handleProceedToPayment = async () => {
    // Obtener token si existe
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (token) {
      // Si hay token, intentar enviar la orden a la API
      try {
        const orderItems = cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }))

        const response = await createOrder(orderItems, token)
        
        // Guardar datos en localStorage para la página de invoice
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        localStorage.setItem('subtotal', subtotal.toString())
        localStorage.setItem('tax', tax.toString())
        localStorage.setItem('total', total.toString())
        localStorage.setItem('orderId', response.data?.id || '')

        router.push('/checkout/invoice')
      } catch (error) {
        console.error('Error creando orden:', error)
        // Fallback si hay error
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        localStorage.setItem('subtotal', subtotal.toString())
        localStorage.setItem('tax', tax.toString())
        localStorage.setItem('total', total.toString())
        router.push('/checkout/invoice')
      }
    } else {
      // Si no hay token, usar localStorage (para testing local)
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      localStorage.setItem('subtotal', subtotal.toString())
      localStorage.setItem('tax', tax.toString())
      localStorage.setItem('total', total.toString())
      router.push('/checkout/invoice')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <section className="bg-muted py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-8">Carrito de Compras</h1>
              <div className="bg-card rounded-lg p-12 text-center">
                <p className="text-lg text-muted-foreground mb-6">Tu carrito está vacío</p>
                <Link href="/store">
                  <Button>Continuar Comprando</Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-8">Carrito de Compras</h1>

            {/* Cart Items */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mx-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="font-bold">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span className="font-semibold">${tax.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Link href="/store" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
                <Button className="flex-1" onClick={handleProceedToPayment}>
                  Proceder al Pago
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
