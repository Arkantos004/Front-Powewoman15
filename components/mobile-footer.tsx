'use client'

import Link from 'next/link'

interface MobileFooterProps {
  items?: {
    label: string
    href: string
    icon?: string
  }[]
}

export function MobileFooter({
  items = [
    { label: 'Inicio', href: '/' },
    { label: 'Cursos', href: '/courses' },
    { label: 'Comunidad', href: '/community', icon: '👥' },
    { label: 'Tienda', href: '/store', icon: '🛒' },
  ],
}: MobileFooterProps) {
  return (
    <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 border-t flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex-1 py-3 text-center font-semibold text-white hover:bg-black/10 transition text-sm md:text-base"
        >
          {item.icon && <span className="mr-1">{item.icon}</span>}
          {item.label}
        </Link>
      ))}
    </div>
  )
}
