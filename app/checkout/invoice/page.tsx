'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface OrderItem {
  id: number
  name: string
  price_cop: number
  quantity: number
}

export default function InvoicePage() {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { items: cartItems, clearCart } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  useEffect(() => {
    if (!orderId) {
      setError('Orden no encontrada. Redirigiendo...')
      setTimeout(() => router.push('/checkout'), 2000)
    }
  }, [orderId, router])

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    
    // Simular procesamiento de pago (2 segundos)
    setTimeout(() => {
      setIsProcessing(false)
      setOrderPlaced(true)
      
      // Limpiar carrito después de la compra
      clearCart()
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background print:bg-white">
      {orderPlaced ? (
        <>
          <Header />
          <main className="flex-1">
            <section className="bg-muted py-12 lg:py-16">
              <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
                <div className="bg-card rounded-lg p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <CheckCircle className="h-16 w-16 text-primary" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">¡Compra Confirmada!</h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Tu pedido ha sido procesado exitosamente. Recibirás un correo con los detalles de tu compra.
                  </p>
                  
                  <div className="bg-muted p-6 rounded-lg mb-8 text-left">
                    <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                    <div className="space-y-2 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between mb-4 text-sm">
                        <span className="text-muted-foreground">IVA (19%)</span>
                        <span>${tax.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/store" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Continuar Comprando
                      </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                      <Button className="w-full">
                        Volver al Inicio
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <section className="bg-muted py-12 lg:py-16 print:bg-white print:py-0">
              <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                {/* Invoice Header */}
                <div className="bg-card rounded-lg p-8 print:rounded-none">
                  <div className="grid grid-cols-2 gap-8 mb-8 border-b pb-8">
                    <div>
                      <h1 className="font-serif text-3xl font-bold mb-2">
                        POWERWOMAN
                      </h1>
                      <p className="text-muted-foreground">
                        Empodera tu talento
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Factura </span>
                        <span className="font-bold">#{Math.floor(Math.random() * 10000).toString().padStart(6, '0')}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold mb-2">Cliente</h3>
                      <p className="text-muted-foreground">Cliente POWERWOMAN</p>
                      <p className="text-muted-foreground text-sm">
                        cliente@powerwoman.com
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">
                        {new Date().toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-8 border-collapse border-t border-b">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-3 font-semibold">Producto</th>
                        <th className="text-center py-3 font-semibold">Cantidad</th>
                        <th className="text-right py-3 font-semibold">Precio</th>
                        <th className="text-right py-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3">{item.name}</td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-right py-3">
                            ${item.price.toLocaleString('es-CO')}
                          </td>
                          <td className="text-right py-3 font-semibold">
                            ${(item.price * item.quantity).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">
                          ${subtotal.toLocaleString('es-CO')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (19%):</span>
                        <span className="font-semibold">${tax.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                        <span>Total a Pagar:</span>
                        <span>${total.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-6 text-center text-sm text-muted-foreground">
                    <p className="mb-2">Gracias por tu compra</p>
                    <p>
                      Para preguntas contacta:{' '}
                      <span className="font-semibold">info@powerwoman.com</span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-8 print:hidden justify-center">
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      className="gap-2"
                    >
                      🖨️ Imprimir
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="gap-2"
                    >
                      {isProcessing ? 'Procesando...' : '✓ Confirmar Pago'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
