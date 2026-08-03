-- Make recruiter_id nullable so platform-curated offers can exist without a recruiter profile
ALTER TABLE job_offers ALTER COLUMN recruiter_id DROP NOT NULL;

-- Seed sample job offers
INSERT INTO job_offers (title, company, location, type, salary, description, required_skills, is_active)
VALUES
  (
    'Conseiller Service Client Bilingue',
    'Teleperformance',
    'Paris, France',
    'CDI',
    '28 000€ - 32 000€ / an',
    'Rejoignez nos équipes en tant que Conseiller Service Client Bilingue. Vous serez en charge de la relation client pour une grande marque internationale, en traitant les demandes par téléphone et email.',
    ARRAY['Communication', 'Empathie', 'Gestion du stress', 'Anglais C1'],
    true
  ),
  (
    'Chargé de Clientèle Pro',
    'Bouygues Telecom',
    'Lyon, France',
    'CDI',
    '30 000€ - 35 000€ / an',
    'Vous gérez un portefeuille de clients professionnels. Vous assurez le suivi commercial, la résolution de problèmes et le développement du chiffre d''affaires.',
    ARRAY['Négociation', 'Relation client', 'Analyse', 'Prospection'],
    true
  ),
  (
    'Commercial Terrain B2B',
    'Schneider Electric',
    'Bordeaux, France',
    'CDI',
    '35 000€ - 42 000€ + commissions',
    'Développez le portefeuille client B2B sur votre secteur. Prospection, visites clients, négociation et suivi commercial.',
    ARRAY['Prospection', 'Négociation', 'Présentation', 'Gestion du temps'],
    true
  ),
  (
    'Stage Marketing Digital',
    'Doctolib',
    'Paris, France',
    'Stage',
    '1 800€ / mois',
    'Stage de 6 mois au sein du pôle marketing digital. Création de contenus, gestion des réseaux sociaux, analyse de campagnes.',
    ARRAY['Créativité', 'Analyse', 'Rédaction', 'Réseaux sociaux'],
    true
  ),
  (
    'Alternance Support IT Niveau 1',
    'Capgemini',
    'Nantes, France',
    'Alternance',
    '1 200€ / mois',
    'Alternance en support technique N1. Prise en charge des tickets, diagnostic, escalade et résolution d''incidents.',
    ARRAY['Rigueur', 'Communication', 'Esprit d''analyse', 'Gestion du stress'],
    true
  ),
  (
    'Conseiller de Vente',
    'Decathlon',
    'Lille, France',
    'CDD',
    '24 000€ / an',
    'Conseil et vente auprès de nos clients sportifs. Mise en rayon, conseil produit, encaissement et fidélisation.',
    ARRAY['Communication', 'Conseil', 'Empathie', 'Dynamisme'],
    true
  )
ON CONFLICT DO NOTHING;
