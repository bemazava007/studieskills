'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    birthDate: '',
    idNumber: '',
    postalCode: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est requis'
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis'
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise"
    if (!formData.birthDate) newErrors.birthDate = 'La date de naissance est requise'
    if (!formData.idNumber.trim()) newErrors.idNumber = "Le numéro d'identité est requis"
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis'
    if (!formData.gender) newErrors.gender = 'Le sexe est requis'
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide'
    if (formData.password.length < 8) newErrors.password = 'Au minimum 8 caractères'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      window.location.href = '/'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary p-4 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">StudieSkills</span>
          </Link>
          <Link href="/login">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-8 rounded-full transition">
              Connexion
            </button>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Créer votre compte</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nom complet"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-2">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Tel: 0XXXXXXXXX"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-2">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.address && <p className="text-xs text-red-600 mt-2">{errors.address}</p>}
            </div>

            {/* Birth Date */}
            <div className="col-span-2 relative">
              <div className="relative">
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  placeholder="Date de naissance: MM/JJ/YYYY"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.birthDate && <p className="text-xs text-red-600 mt-2">{errors.birthDate}</p>}
            </div>

            {/* ID Number */}
            <div>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder="N°carte d'identité"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.idNumber && <p className="text-xs text-red-600 mt-2">{errors.idNumber}</p>}
            </div>

            {/* Postal Code */}
            <div>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Code postal"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.postalCode && <p className="text-xs text-red-600 mt-2">{errors.postalCode}</p>}
            </div>

            {/* Gender */}
            <div className="col-span-2">
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none cursor-pointer"
              >
                <option value="">Sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
              {errors.gender && <p className="text-xs text-red-600 mt-2">{errors.gender}</p>}
            </div>

            {/* Email */}
            <div className="col-span-2">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email: exemple@gmail.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.email && <p className="text-xs text-red-600 mt-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mot de passe"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.password && <p className="text-xs text-red-600 mt-2">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirmer mot de passe"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-2">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="col-span-2 flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
              </label>
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Création...
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-foreground mt-8">
            Vous avez déjà un compte?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
