import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la autenticación
export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

export interface AuthResponse {
  user: AuthUser | null
  error: Error | null
}

// Funciones de autenticación
export const authService = {
  // Iniciar sesión con email y contraseña
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      return {
        user: data.user as AuthUser,
        error: error as Error | null
      }
    } catch (error) {
      return {
        user: null,
        error: error as Error
      }
    }
  },

  // Registrarse con email y contraseña
  async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })
      
      return {
        user: data.user as AuthUser,
        error: error as Error | null
      }
    } catch (error) {
      return {
        user: null,
        error: error as Error
      }
    }
  },

  // Iniciar sesión con Google
  async signInWithGoogle(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}#dashboard`
        }
      })
      
      return { error: error as Error | null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Cerrar sesión
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error as Error | null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user as AuthUser
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as AuthUser || null)
    })
  }
}