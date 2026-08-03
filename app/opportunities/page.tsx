'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Briefcase, Clock, ChevronRight, Loader2, X } from 'lucide-react'
import { getJobOffers, applyToJob } from '@/lib/api'
import type { JobOffer } from '@/lib/types'

export default function OpportunitiesPage() {
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [coverMessage, setCoverMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadOffers()
  }, [])

  async function loadOffers() {
    try {
      const data = await getJobOffers()
      setOffers(data)
    } catch (err) {
      console.error('Failed to load job offers:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || offer.type === selectedType
    return matchesSearch && matchesType
  })

  async function handleApply() {
    if (!selectedOffer) return
    setApplying(true)
    setApplyError('')
    try {
      await applyToJob(selectedOffer.id, coverMessage)
      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
        setSelectedOffer(null)
        setCoverMessage('')
      }, 2000)
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Erreur lors de la candidature')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Opportunités d'emploi</h1>
          <Link href="/" className="text-sm text-primary hover:underline">Tableau de bord</Link>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une offre, une entreprise..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'CDI', 'CDD', 'Stage', 'Alternance'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      selectedType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:border-primary'
                    }`}
                  >
                    {type === 'all' ? 'Tous' : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filtered.length} opportunité{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                <p className="text-sm font-medium text-muted-foreground">Aucune offre pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map(offer => (
                  <div key={offer.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{offer.title}</h3>
                        <p className="text-muted-foreground text-sm">{offer.company}</p>
                      </div>
                    </div>

                    {offer.description && <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {offer.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{offer.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{offer.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(offer.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {offer.salary && <div className="text-sm font-semibold text-foreground">{offer.salary}</div>}
                    </div>

                    {offer.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {offer.required_skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => { setSelectedOffer(offer); setShowModal(true); setApplyError(''); setSuccess(false); }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      Postuler
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-8 max-w-md w-full border border-border relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-2">Postuler</h2>
            <p className="text-muted-foreground mb-6">
              Postulez pour <span className="font-semibold text-foreground">{selectedOffer.title}</span> chez <span className="font-semibold text-foreground">{selectedOffer.company}</span>
            </p>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-700 font-medium">
                Candidature envoyée avec succès !
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message de motivation (optionnel)</label>
                    <textarea
                      value={coverMessage}
                      onChange={(e) => setCoverMessage(e.target.value)}
                      placeholder="Parlez-nous de votre motivation..."
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none h-24"
                    />
                  </div>
                  {applyError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                      {applyError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-input hover:bg-secondary text-foreground font-medium py-2.5 px-4 rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {applying ? <Loader2 className="size-4 animate-spin" /> : 'Envoyer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
