import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacto" className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold">
              POWERWOMAN
            </Link>
            <p className="mt-4 text-background/70 text-sm leading-relaxed">
              Descubre tu poder interior a través del arte del maquillaje profesional.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Inicio */}
          <div>
            <h3 className="font-semibold mb-4">Inicio</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Información
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="font-semibold mb-4">Cursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Todos los Cursos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Ubicación
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Certificaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="font-semibold mb-4">Tienda</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background text-sm transition-colors">
                  Envíos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2026 POWERWOMAN. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-background/50 hover:text-background text-sm transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="text-background/50 hover:text-background text-sm transition-colors">
              Términos
            </Link>
            <Link href="/admin/login" className="text-background/50 hover:text-background text-xs transition-colors opacity-50 hover:opacity-100">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
