import { useAuth } from '@/hooks/use-auth'
import { CheckCircle2, LogIn } from 'lucide-react'

export function AuthStatusBadge() {
  const { isLoggedIn, user, isLoading } = useAuth()

  if (isLoading || !isLoggedIn) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
        <LogIn className="h-3.5 w-3.5" />
        <span>No autenticado</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm text-green-700">
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>{user?.full_name || 'Autenticado'}</span>
    </div>
  )
}
