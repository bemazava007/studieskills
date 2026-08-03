'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, Settings, MapPin, Briefcase, Clock, ChevronRight, Search } from 'lucide-react'

const opportunities = [
  {
    id: 1,
    title: 'Agent d\'accueil - CDI',
    company: 'Orange Telecom',
    location: 'Paris (75)',
    type: 'CDI',
    salary: '22k - 26k €/an',
    description: 'Rejoignez notre équipe customer success! Vous aurez pour mission d\'assurer la satisfaction client...',
    requiredLevel: 2,
    match: 85,
    skills: ['Empathie', 'Clarté', 'Écoute'],
    posted: '2 jours',
    logo: '🟠',
  },
  {
    id: 2,
    title: 'Commercial B2B - Stage 6 mois',
    company: 'SFR Business',
    location: 'Lyon (69)',
    type: 'Stage',
    salary: '600-800 €/mois',
    description: 'Stage commercial avec accompagnement. Développez vos compétences en négociation et vente...',
    requiredLevel: 1,
    match: 92,
    skills: ['Résolution', 'Écoute'],
    posted: '1 jour',
    logo: '🔴',
  },
  {
    id: 3,
    title: 'Responsable Support Client - CDD',
    company: 'Bouygues Telecom',
    location: 'Bordeaux (33)',
    type: 'CDD',
    salary: '27k - 32k €/an',
    description: 'Pilotez une équipe de 5 agents support. Gestion de la qualité et optimisation des process...',
    requiredLevel: 3,
    match: 76,
    skills: ['Empathie', 'Clarté', 'Résolution', 'Management'],
    posted: '5 jours',
    logo: '🔵',
  },
  {
    id: 4,
    title: 'Opérateur Télécom - CDI',
    company: 'Free Mobile',
    location: 'Toulouse (31)',
    type: 'CDI',
    salary: '20k - 24k €/an',
    description: 'Traitement des appels, gestion des abonnements et offres commerciales...',
    requiredLevel: 1,
    match: 88,
    skills: ['Empathie', 'Résolution'],
    posted: '3 jours',
    logo: '🟢',
  },
]

export default function OpportunitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState<typeof opportunities[0] | null>(null)

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || opp.type === selectedType
    const matchesLevel = selectedLevel === 'all' || opp.requiredLevel <= parseInt(selectedLevel)
    return matchesSearch && matchesType && matchesLevel
  })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 flex flex-col p-4 fixed md:relative z-40 h-screen`}>
        <Link href="/" className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-foreground">StudieSkills</span>}
        </Link>

        <nav className="space-y-2 flex-1">
          {[
            { label: 'Tableau de bord', href: '/' },
            { label: 'Mes Simulateurs', href: '/' },
            { label: 'Mes Performances', href: '/performances' },
            { label: 'Opportunités', href: '/opportunities', active: true },
            { label: 'Mes Certificats', href: '/' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <div className="w-5 h-5 bg-current rounded" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground md:hidden"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Opportunités d'emploi</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            {/* Search & Filters */}
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

              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Type de contrat</label>
                  <div className="flex gap-2">
                    {['all', 'CDI', 'CDD', 'Stage'].map(type => (
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

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Niveau requis</label>
                  <div className="flex gap-2">
                    {['all', '1', '2', '3'].map(level => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          selectedLevel === level
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:border-primary'
                        }`}
                      >
                        {level === 'all' ? 'Tous' : `Niveau ${level}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredOpportunities.length} opportunité{filteredOpportunities.length !== 1 ? 's' : ''} trouvée{filteredOpportunities.length !== 1 ? 's' : ''}
            </div>

            {/* Opportunities List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredOpportunities.map(opp => (
                <div key={opp.id} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="text-3xl">{opp.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">{opp.title}</h3>
                            <p className="text-muted-foreground text-sm">{opp.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{opp.match}%</div>
                            <p className="text-xs text-muted-foreground">compatibilité</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{opp.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{opp.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{opp.posted}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{opp.salary}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {opp.skills.map(skill => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOpp(opp)
                      setShowApplicationModal(true)
                    }}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    Postuler
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedOpp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-8 max-w-md w-full border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">Postuler</h2>
            <p className="text-muted-foreground mb-6">
              Postulez pour <span className="font-semibold text-foreground">{selectedOpp.title}</span> chez <span className="font-semibold text-foreground">{selectedOpp.company}</span>
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email de contact</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message (optionnel)</label>
                <textarea
                  placeholder="Parlez-nous de votre motivation..."
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none h-24"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 border border-input hover:bg-secondary text-foreground font-medium py-2.5 px-4 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowApplicationModal(false)
                  alert(`Candidature envoyée pour ${selectedOpp.title}!`)
                }}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Envoyer la candidature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
