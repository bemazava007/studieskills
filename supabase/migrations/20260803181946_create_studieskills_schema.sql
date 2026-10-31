
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','recruiter')),
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'recruiter')
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── PROFESSIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS professions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  sector text DEFAULT '',
  required_skills text[] DEFAULT '{}',
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE professions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professions_read_all" ON professions;
CREATE POLICY "professions_read_all" ON professions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "professions_admin_write" ON professions;
CREATE POLICY "professions_admin_write" ON professions FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "professions_admin_update" ON professions;
CREATE POLICY "professions_admin_update" ON professions FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "professions_admin_delete" ON professions;
CREATE POLICY "professions_admin_delete" ON professions FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Now add the FK from profiles to professions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'target_profession_id') THEN
    ALTER TABLE profiles ADD COLUMN target_profession_id uuid REFERENCES professions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ─── SIMULATORS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profession_id uuid REFERENCES professions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  difficulty text NOT NULL DEFAULT 'debutant' CHECK (difficulty IN ('debutant','intermediaire','avance')),
  system_prompt text NOT NULL,
  skills_evaluated text[] DEFAULT '{}',
  duration_minutes int DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "simulators_read_all" ON simulators;
CREATE POLICY "simulators_read_all" ON simulators FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "simulators_admin_write" ON simulators;
CREATE POLICY "simulators_admin_write" ON simulators FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "simulators_admin_update" ON simulators;
CREATE POLICY "simulators_admin_update" ON simulators FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "simulators_admin_delete" ON simulators;
CREATE POLICY "simulators_admin_delete" ON simulators FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ─── SIMULATION_SESSIONS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  simulator_id uuid NOT NULL REFERENCES simulators(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  score int DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select_own" ON simulation_sessions;
CREATE POLICY "sessions_select_own" ON simulation_sessions FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','recruiter'))
  );

DROP POLICY IF EXISTS "sessions_insert_own" ON simulation_sessions;
CREATE POLICY "sessions_insert_own" ON simulation_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_update_own" ON simulation_sessions;
CREATE POLICY "sessions_update_own" ON simulation_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sessions_delete_own" ON simulation_sessions;
CREATE POLICY "sessions_delete_own" ON simulation_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── SESSION_MESSAGES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES simulation_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_own" ON session_messages;
CREATE POLICY "messages_select_own" ON session_messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM simulation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','recruiter'))
  );

DROP POLICY IF EXISTS "messages_insert_own" ON session_messages;
CREATE POLICY "messages_insert_own" ON session_messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM simulation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

-- ─── SKILL_EVALUATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES simulation_sessions(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  score int NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  feedback text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skill_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evaluations_select_own" ON skill_evaluations;
CREATE POLICY "evaluations_select_own" ON skill_evaluations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM simulation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','recruiter'))
  );

DROP POLICY IF EXISTS "evaluations_insert_own" ON skill_evaluations;
CREATE POLICY "evaluations_insert_own" ON skill_evaluations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM simulation_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

-- ─── PROGRESS_PLANS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progress_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES simulation_sessions(id) ON DELETE SET NULL,
  skill_name text NOT NULL,
  current_score int NOT NULL DEFAULT 0,
  target_score int NOT NULL DEFAULT 80,
  exercises text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE progress_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plans_select_own" ON progress_plans;
CREATE POLICY "plans_select_own" ON progress_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plans_insert_own" ON progress_plans;
CREATE POLICY "plans_insert_own" ON progress_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "plans_delete_own" ON progress_plans;
CREATE POLICY "plans_delete_own" ON progress_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── CERTIFICATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profession_id uuid REFERENCES professions(id) ON DELETE SET NULL,
  title text NOT NULL,
  issuer text DEFAULT 'StudieSkills Academy',
  score int NOT NULL DEFAULT 0,
  issued_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certs_select_own" ON certifications;
CREATE POLICY "certs_select_own" ON certifications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','recruiter'))
  );

DROP POLICY IF EXISTS "certs_insert_own" ON certifications;
CREATE POLICY "certs_insert_own" ON certifications FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ─── RECRUITER_PROFILES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text DEFAULT '',
  website text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recruiters_select_all" ON recruiter_profiles;
CREATE POLICY "recruiters_select_all" ON recruiter_profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "recruiters_insert_own" ON recruiter_profiles;
CREATE POLICY "recruiters_insert_own" ON recruiter_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "recruiters_update_own" ON recruiter_profiles;
CREATE POLICY "recruiters_update_own" ON recruiter_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── JOB_OFFERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text DEFAULT '',
  type text DEFAULT 'CDI' CHECK (type IN ('CDI','CDD','Stage','Alternance')),
  salary text DEFAULT '',
  description text DEFAULT '',
  required_skills text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "offers_read_all" ON job_offers;
CREATE POLICY "offers_read_all" ON job_offers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "offers_insert_own" ON job_offers;
CREATE POLICY "offers_insert_own" ON job_offers FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM recruiter_profiles r WHERE r.user_id = auth.uid() AND r.id = recruiter_id)
  );

DROP POLICY IF EXISTS "offers_update_own" ON job_offers;
CREATE POLICY "offers_update_own" ON job_offers FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM recruiter_profiles r WHERE r.user_id = auth.uid() AND r.id = recruiter_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM recruiter_profiles r WHERE r.user_id = auth.uid() AND r.id = recruiter_id)
  );

DROP POLICY IF EXISTS "offers_delete_own" ON job_offers;
CREATE POLICY "offers_delete_own" ON job_offers FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM recruiter_profiles r WHERE r.user_id = auth.uid() AND r.id = recruiter_id)
  );

-- ─── APPLICATIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_offer_id uuid NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','accepted','rejected')),
  cover_message text DEFAULT '',
  recruiter_feedback text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_select_parties" ON applications;
CREATE POLICY "applications_select_parties" ON applications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM job_offers jo JOIN recruiter_profiles rp ON rp.id = jo.recruiter_id WHERE jo.id = job_offer_id AND rp.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "applications_insert_own" ON applications;
CREATE POLICY "applications_insert_own" ON applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_update_recruiter" ON applications;
CREATE POLICY "applications_update_recruiter" ON applications FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM job_offers jo JOIN recruiter_profiles rp ON rp.id = jo.recruiter_id WHERE jo.id = job_offer_id AND rp.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM job_offers jo JOIN recruiter_profiles rp ON rp.id = jo.recruiter_id WHERE jo.id = job_offer_id AND rp.user_id = auth.uid())
  );

-- ─── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user ON simulation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_simulator ON simulation_sessions(simulator_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_session ON skill_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_plans_user ON progress_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_certs_user ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_recruiter ON job_offers(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_offer ON applications(job_offer_id);

-- ─── AUTO-UPDATE updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ─────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── SEED DATA: PROFESSIONS ────────────────────────────────────
INSERT INTO professions (title, description, sector, required_skills, icon) VALUES
  ('Conseiller Service Client', 'Gerer les appels clients, resoudre les plaintes, adopter un ton professionnel.', 'Service Client', ARRAY['Empathie','Ecoute active','Clarte','Gestion du stress'], 'headset'),
  ('Commercial B2B', 'Developpement commercial, prospection et negociation avec des entreprises.', 'Vente', ARRAY['Negociation','Persuasion','Ecoute','Resolution de problemes'], 'briefcase'),
  ('Technicien Maintenance IT', 'Diagnostic et reparation de pannes informatiques, support technique.', 'IT', ARRAY['Diagnostic','Methodologie','Communication technique','Patience'], 'wrench'),
  ('Responsable Marketing Digital', 'Pilotage de strategies marketing digitales et gestion de campagnes.', 'Marketing', ARRAY['Strategie','Analyse de donnees','Creativite','Communication'], 'megaphone'),
  ('Developpeur Full Stack', 'Conception et developpement d applications web front-end et back-end.', 'IT', ARRAY['Logique','Resolution de problemes','Rigueur','Travail en equipe'], 'code')
ON CONFLICT DO NOTHING;

-- ─── SEED DATA: SIMULATORS ─────────────────────────────────────
INSERT INTO simulators (profession_id, title, description, category, difficulty, system_prompt, skills_evaluated, duration_minutes)
SELECT p.id, 'Simulation Service Client - Client Mecontent', 'Gerer un appel avec un client furieux concernant une facturation incorrecte.', 'Service Client', 'debutant',
  'Tu es un client tres mecontent qui appelle le service client. Tu es fache a cause d une facturation incorrecte sur ta derniere facture. Sois realiste, expressif et reactif. Reagis en fonction des reponses du conseiller. Si le conseiller est empathique et professionnel, calme-toi progressivement. Si il est froid ou robotique, reste fache. Reste dans le role du client a tout moment. Parle en francais.',
  ARRAY['Empathie','Clarte','Resolution','Ecoute'], 30
FROM professions p WHERE p.title = 'Conseiller Service Client'
ON CONFLICT DO NOTHING;

INSERT INTO simulators (profession_id, title, description, category, difficulty, system_prompt, skills_evaluated, duration_minutes)
SELECT p.id, 'Simulation Vente - Prospect Neutre', 'Convaincre un prospect neutre d acheter un produit SaaS.', 'Vente', 'intermediaire',
  'Tu es un prospect neutre que un commercial essaie de convaincre d acheter un produit SaaS. Tu es interesse mais sceptique. Pose des questions sur le produit, le prix, et les concurrents. Sois exigeant mais juste. Si le commercial repond bien a tes objections, montre de l interet. Si il est trop poussif, reste froid. Parle en francais.',
  ARRAY['Negociation','Persuasion','Ecoute','Clarte'], 40
FROM professions p WHERE p.title = 'Commercial B2B'
ON CONFLICT DO NOTHING;

INSERT INTO simulators (profession_id, title, description, category, difficulty, system_prompt, skills_evaluated, duration_minutes)
SELECT p.id, 'Simulation Entretien d Embauche', 'Reussir un entretien d embauche pour un poste de technicien IT.', 'Soft Skills', 'debutant',
  'Tu es un recruteur qui fait passer un entretien d embauche pour un poste de technicien de maintenance informatique. Pose des questions classiques (presentation, experience, forces/faiblesses, gestion de conflits). Sois professionnel mais exigeant. Note mentalement les reponses du candidat. Parle en francais.',
  ARRAY['Communication','Confiance','Clarte','Ecoute'], 35
FROM professions p WHERE p.title = 'Technicien Maintenance IT'
ON CONFLICT DO NOTHING;
