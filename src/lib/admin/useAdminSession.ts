import { useCallback, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { checkIsAdmin, adminLogin } from '@/lib/admin/service'

/**
 * Sessão administrativa — Etapa 4. O login é o mesmo authWithPassword do
 * `users`; a verificação de pertencimento é feita na coleção `admins`
 * (via checkIsAdmin). Sincroniza com pb.authStore.onChange.
 */
export function useAdminSession() {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const recheck = useCallback(async () => {
    if (!pb.authStore.isValid) {
      setIsAdmin(false)
      setChecking(false)
      return
    }
    setChecking(true)
    try {
      setIsAdmin(await checkIsAdmin())
    } catch {
      setIsAdmin(false)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      recheck()
    })
    recheck()
    return unsub
  }, [recheck])

  const login = useCallback(async (email: string, password: string) => {
    await adminLogin(email, password)
    return checkIsAdmin()
  }, [])

  const logout = useCallback(() => {
    pb.authStore.clear()
    setIsAdmin(false)
  }, [])

  return { checking, isAdmin, login, logout }
}
