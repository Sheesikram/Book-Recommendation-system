import React from 'react'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Auth = () => {
  const { user, signOut } = useAuth()

  if (user) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 text-center space-y-6">
          <p className="text-4xl">🎉</p>
          <h1 className="text-2xl font-semibold text-gray-800">You are signed in</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Explore books
            </Link>
            <button
              onClick={signOut}
              className="w-full border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-widest text-gray-600">BookHub</p>
          <h1 className="text-3xl font-bold text-gray-900">Sign in or create an account</h1>
          <p className="text-gray-600">Use Google or email/password with Supabase Auth.</p>
        </div>

        <SupabaseAuth
          supabaseClient={supabase}
          providers={['google']}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1f2937',
                  brandAccent: '#2563eb',
                },
              },
            },
          }}
          view="sign_in"
          showLinks={true}
          socialLayout="horizontal"
          redirectTo={import.meta.env.VITE_SITE_URL}
        />
        <p className="text-xs text-gray-500 text-center">
          Need help?{' '}
          <a className="underline hover:text-gray-900" href="mailto:support@example.com">
            Contact support
          </a>
        </p>
      </div>
    </section>
  )
}

export default Auth

