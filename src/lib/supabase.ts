import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Crear cliente de Supabase con manejo de errores
export const supabase = (() => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Supabase no configurado correctamente. Usando modo demo.');
    // Retornar un objeto mock para desarrollo
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Demo mode') }),
        signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Demo mode') }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Demo mode') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any
  }
})()

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
    return supabase.auth.onAuthStateChange((event: any, session: any) => {
      callback(session?.user as AuthUser || null)
    })
  }
}