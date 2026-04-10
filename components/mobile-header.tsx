'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface MobileHeaderProps {
  title: string
  showProfile?: boolean
  backHref?: string
}

export function MobileHeader({
  title,
  showProfile = true,
  backHref = '/',
}: MobileHeaderProps) {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref}>
            <ChevronLeft className="w-6 h-6 hover:text-pink-500 transition" />
          </Link>
        )}
        <h1 className="text-lg md:text-xl font-bold text-gray-800">{title}</h1>
      </div>
      {showProfile && (
        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition">
          <span className="text-lg">👤</span>
        </Link>
      )}
    </div>
  )
}
