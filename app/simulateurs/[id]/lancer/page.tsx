// 'use client'

// import { LevelProgression } from '@/components/dashboard/level-progression'

// const quizzesData: Record<string, any> = {
//   '1': {
//     title: 'Call Center Orange',
//     questions: [
//       {
//         id: '1',
//         text: 'Un client est mécontent de votre service. Quelle est la première étape?',
//         options: [
//           'Écouter activement ses préoccupations',
//           'Argumenter pourquoi le service est bon',
//           'Transférer immédiatement au superviseur',
//           'Lui offrir une réduction',
//         ],
//         correct: 0,
//         explanation:
//           'L\'écoute active est la première étape cruciale pour résoudre les conflits avec les clients. Cela montre que vous les comprenez et les respectez.',
//       },
//       {
//         id: '2',
//         text: 'Quel est le temps d\'attente idéal pour une réponse client?',
//         options: ['5 minutes', '30 secondes', 'Aussi vite que possible', '1 heure'],
//         correct: 2,
//         explanation:
//           'Les clients modernes s\'attendent à une réponse rapide. "Aussi vite que possible" reconnaît que le contexte varie mais que la rapidité est toujours importante.',
//       },
//       {
//         id: '3',
//         text: 'Comment gérer un client qui parle très vite et est difficile à comprendre?',
//         options: [
//           'Demander poliment de parler plus lentement',
//           'Continuer et espérer comprendre',
//           'Racrocher et rappeler',
//           'Mettre en attente',
//         ],
//         correct: 0,
//         explanation:
//           'Demander poliment au client de parler plus lentement montre du respect et aide à assurer une communication claire.',
//       },
//       {
//         id: '4',
//         text: 'Quel est le meilleur ton de voix à utiliser avec un client en colère?',
//         options: [
//           'Agressif et direct',
//           'Calme, empathique et professionnel',
//           'Neutre et robotique',
//           'Sarcastique et humoristique',
//         ],
//         correct: 1,
//         explanation:
//           'Un ton calme et empathique aide à désamorcer les tensions et montre au client que vous prenez ses préoccupations au sérieux.',
//       },
//       {
//         id: '5',
//         text: 'Comment terminer un appel client professionnel?',
//         options: [
//           'Raccrocher dès que possible',
//           'Résumer la conversation et vérifier la satisfaction',
//           'Dire au revoir rapidement',
//           'Transférer à un autre département',
//         ],
//         correct: 1,
//         explanation:
//           'Résumer la conversation et vérifier la satisfaction du client assure une expérience positive et montre votre professionnalisme.',
//       },
//     ],
//   },
//   '2': {
//     title: 'Vente & Négociation',
//     questions: [
//       {
//         id: '1',
//         text: 'Quel est le secret d\'une bonne négociation commerciale?',
//         options: [
//           'Dominer l\'autre partie',
//           'Rechercher une solution gagnant-gagnant',
//           'Faire baisser les prix au maximum',
//           'Négocier seul sans conseil',
//         ],
//         correct: 1,
//         explanation:
//           'Une bonne négociation crée de la valeur pour les deux parties. Cela maintient une relation à long terme et la confiance.',
//       },
//       {
//         id: '2',
//         text: 'Quand devez-vous révéler votre prix final?',
//         options: [
//           'Immédiatement au démarrage',
//           'Après avoir compris les besoins du client',
//           'Seulement si le client l\'demande',
//           'Au téléphone d\'abord',
//         ],
//         correct: 1,
//         explanation:
//           'Comprendre d\'abord les besoins du client vous permet d\'ajuster votre proposition et de justifier votre prix.',
//       },
//       {
//         id: '3',
//         text: 'Quelle est la technique AIDA en vente?',
//         options: [
//           'Attention, Intérêt, Désir, Action',
//           'Accord, Impôt, Dépôt, Arrivée',
//           'Attaque, Intérim, Droits, Appels',
//           'Aide, Infos, Données, Analyse',
//         ],
//         correct: 0,
//         explanation:
//           'AIDA est un modèle classique de vente: Attention (attirer), Intérêt (générer), Désir (créer envie), Action (conclure).',
//       },
//       {
//         id: '4',
//         text: 'Comment répondre à une objection cliente concernant le prix?',
//         options: [
//           'Baisser immédiatement le prix',
//           'Ignorer l\'objection',
//           'Montrer la valeur ajoutée et les bénéfices',
//           'Dire que c\'est le meilleur prix du marché',
//         ],
//         correct: 2,
//         explanation:
//           'Montrer la valeur et les bénéfices aide le client à comprendre pourquoi le prix est justifié.',
//       },
//       {
//         id: '5',
//         text: 'Quel est le timing idéal pour conclure une vente?',
//         options: [
//           'Après une longue présentation',
//           'Dès les premières minutes',
//           'Quand les objections sont surmontées',
//           'A la fin de chaque mois',
//         ],
//         correct: 2,
//         explanation:
//           'Conclure après avoir surmonté les objections montre que le client est prêt et intéressé.',
//       },
//     ],
//   },
// }

// // Map simulator slugs to titles
// const simulatorMap: Record<string, { title: string; id: string }> = {
//   'call-center-orange': { title: 'Call Center Orange', id: 'call-center-orange' },
//   'vente-negociation': { title: 'Vente & Négociation', id: 'vente-negociation' },
//   'maintenance-informatique': { title: 'Maintenance Informatique', id: 'maintenance-informatique' },
//   'entretien-professionnel': { title: 'Entretien Professionnel', id: 'entretien-professionnel' },
// }

// export default async function QuizPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params
//   const simulator = simulatorMap[id as string] || simulatorMap['call-center-orange']

//   return (
//     <LevelProgression
//       simulatorTitle={simulator.title}
//       simulatorId={simulator.id}
//       totalLevels={5}
//       currentLevelId={1}
//     />
//   )
// }
