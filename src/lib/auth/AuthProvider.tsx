import pb from '@/lib/pocketbase/client'
import { useLocale } from '@/i18n/LocaleContext'
import { AuthContext } from './AuthContext'
import { useEffect, useState } from 'react'

/**
 * Estado de autenticação do visitante. Usa a coleção `users` existente
 * (não modificada); perfil estendido mora em `profiles` (1:1 via `user`).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | {
    id: string
    email: string
    name: string
    isAdmin: boolean
  }>(null)
  const [ready, setReady] = useState(false)
  const { locale } = useLocale()

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      const model = pb.authStore.record
      setUser(
        model
          ? {
              id: model.id,
              email: model.email ?? '',
              name: (model.name as string) || (model.email as string) || '',
              isAdmin: Boolean(model.is_admin),
            }
          : null,
      )
    }, true)
    setReady(true)
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await pb.collection('users').authWithPassword(email, password)
  }

  const signup = async (name: string, email: string, password: string, consent: boolean) => {
    if (!consent)
      throw new Error(
        locale === 'pt-br'
          ? 'Consentimento LGPD obrigatório'
          : locale === 'es'
            ? 'Se requiere consentimiento LGPD'
            : 'LGPD consent is required',
      )
    await pb.collection('users').create({
      name,
      email,
      password,
      passwordConfirm: password,
    })
    await pb.collection('users').requestVerification(email)
    await pb.collection('users').authWithPassword(email, password)
  }

  const logout = () => pb.authStore.clear()

  const requestPasswordReset = async (email: string) => {
    await pb.collection('users').requestPasswordReset(email)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  )
}
