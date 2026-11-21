import { createContext, useContext } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

export interface AuthContextValue {
  user: AuthUser | null
  ready: boolean
  login(email: string, password: string): Promise<void>
  signup(name: string, email: string, password: string, consent: boolean): Promise<void>
  logout(): void
  requestPasswordReset(email: string): Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  requestPasswordReset: async () => {},
})

export const useAuth = () => useContext(AuthContext)
