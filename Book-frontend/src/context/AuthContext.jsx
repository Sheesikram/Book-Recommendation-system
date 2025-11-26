/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to get Supabase session', error)
      }

      if (isMounted) {
        setSession(session ?? null)
        setUser(session?.user ?? null)
        setInitializing(false)
      }
    }

    initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
      setUser(newSession?.user ?? null)
      setInitializing(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    const syncProfile = async () => {
      const payload = {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.user_name ||
          null,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        raw_user_meta: user.user_metadata ?? {},
        last_login_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(payload, {
        onConflict: 'id',
      })

      if (error && !cancelled) {
        console.error('Failed to sync user profile', error)
      }
    }

    syncProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  const loginWithGoogle = () => {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Failed to sign out', error)
    }
  }

  const value = useMemo(
    () => ({ session, user, initializing, loginWithGoogle, signOut }),
    [session, user, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
