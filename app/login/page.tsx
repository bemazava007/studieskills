'use client'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)

try {
  const { data, error: signInError } = await signIn(
    email,
    password
  )

  if (signInError) {
    setError(
      signInError.message || 'Email ou mot de passe incorrect'
    )
    return
  }

  if (!data.user || !data.session) {
    setError('La connexion n’a pas créé de session.')
    return
  }

  console.log('✅ Login réussi')
  console.log('User:', data.user.id)
  console.log('Session:', data.session.access_token ? 'OK' : 'ABSENTE')

  // Vérification réelle de la session stockée
  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !sessionData.session) {
    console.error('❌ Session non persistée:', sessionError)

    setError(
      'Connexion réussie mais la session n’a pas été persistée.'
    )

    return
  }

  console.log('✅ Session persistée')

  router.push('/simulateurs')
} catch (err) {
  console.error('❌ Login:', err)
  setError('Erreur lors de la connexion')
} finally {
  setIsLoading(false)
}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-2 gap-12 items-center">
        {/* Left Side - Logo & Branding */}
        <div className="flex flex-col gap-8">
          <Link href="/" className="inline-flex items-center gap-3 w-fit">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-2xl font-bold text-foreground">StudieSkills</span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Bienvenue</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Connectez-vous pour accéder à votre tableau de bord et continuer vos formations en simulation professionnelle.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Mot de passe oublié?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                'Connexion'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full border border-gray-300 hover:bg-gray-50 text-foreground py-3 px-4 rounded-lg transition font-medium text-sm">
              Continuer avec Google
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 text-foreground py-3 px-4 rounded-lg transition font-medium text-sm">
              Continuer avec LinkedIn
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-foreground mt-6">
            Pas encore de compte?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
