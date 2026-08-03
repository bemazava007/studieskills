import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { SimulatorDetails } from '@/components/dashboard/simulator-details'

// Mock data for demonstration
const simulatorsData: Record<string, any> = {
  'call-center-orange': {
    id: '1',
    title: 'Call Center Orange',
    description:
      'Apprendre les techniques essentielles pour gérer des appels clients dans un environnement de centre d\'appels professionnel. Ce simulateur couvre la communication efficace, la résolution de problèmes et la gestion du stress.',
    level: 'Intermédiaire',
    duration: 45,
    participants: 1250,
    rating: 4.5,
    reviews: 128,
    progression: 80,
    questionsCount: 20,
    category: 'Centre d\'appels',
  },
  'vente-negociation': {
    id: '2',
    title: 'Vente & Négociation',
    description:
      'Maîtrisez l\'art de la vente et de la négociation commerciale. Développez vos compétences en persuasion, écoute active et conclusion de deals.',
    level: 'Avancé',
    duration: 60,
    participants: 890,
    rating: 4.8,
    reviews: 95,
    progression: 0,
    questionsCount: 25,
    category: 'Vente',
  },
  'maintenance-informatique': {
    id: '3',
    title: 'Maintenance Informatique',
    description:
      'Résoudre des pannes techniques et apprendre à diagnostiquer les problèmes informatiques courants.',
    level: 'Débutant',
    duration: 30,
    participants: 650,
    rating: 4.3,
    reviews: 72,
    progression: 60,
    questionsCount: 15,
    category: 'IT',
  },
  'entretien-professionnel': {
    id: '4',
    title: 'Entretien Professionnel',
    description:
      'Préparer-vous à un entretien d\'embauche avec des conseils pratiques et des simulations réalistes.',
    level: 'Débutant',
    duration: 35,
    participants: 1100,
    rating: 4.6,
    reviews: 145,
    progression: 100,
    questionsCount: 18,
    category: 'Soft Skills',
  },
}

export default async function SimulatorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const simulator = simulatorsData[id as string] || simulatorsData['call-center-orange']

  return (
    <DashboardShell title={simulator.title}>
      <SimulatorDetails {...simulator} />
    </DashboardShell>
  )
}
