-- 🎯 NÚCLEO TÁTICO - SCHEMA DO BANCO DE DADOS
-- Licença: PostgreSQL License (permissiva)

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- USUÁRIOS
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  study_time_minutes INTEGER DEFAULT 0
);

-- ESTADOS E CONCURSOS
CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  uf CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE contests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state_id INTEGER REFERENCES states(id),
  organization VARCHAR(255),
  level VARCHAR(50), -- federal, estadual, municipal
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISCIPLINAS
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6'
);

-- BANCAS EXAMINADORAS
CREATE TABLE exam_boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  acronym VARCHAR(20) UNIQUE NOT NULL,
  description TEXT
);

-- ============================================
-- BANCO DE QUESTÕES
-- ============================================

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_board_id INTEGER REFERENCES exam_boards(id),
  contest_id INTEGER REFERENCES contests(id),
  subject_id INTEGER REFERENCES subjects(id),
  year INTEGER,
  question_number INTEGER,
  question_text TEXT NOT NULL,
  alternatives JSONB NOT NULL, -- [{letter: 'A', text: '...', correct: true}, ...]
  explanation TEXT,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'very_hard')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DESEMPENHO DO ALUNO
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  question_id INTEGER REFERENCES questions(id) NOT NULL,
  selected_alternative CHAR(1),
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- CADERNO DE ERROS
CREATE TABLE error_notebook (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  question_id INTEGER REFERENCES questions(id) NOT NULL,
  mistake_type VARCHAR(100),
  notes TEXT,
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APOSTILAS E CONTEÚDOS
-- ============================================

CREATE TABLE study_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_markdown TEXT,
  content_html TEXT,
  subject_id INTEGER REFERENCES subjects(id),
  contest_id INTEGER REFERENCES contests(id),
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GERADOR DE APOSTILAS
CREATE TABLE generated_booklets (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  config JSONB NOT NULL, -- {subjects: [], contests: [], difficulty: ...}
  pdf_url TEXT,
  markdown_content TEXT,
  status VARCHAR(20) DEFAULT 'generating',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- DASHBOARD E ESTATÍSTICAS
-- ============================================

CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  subject_id INTEGER REFERENCES subjects(id)
);

-- ESTATÍSTICAS DIÁRIAS
CREATE TABLE daily_stats (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  study_time_minutes INTEGER DEFAULT 0,
  subjects_covered TEXT[] DEFAULT '{}',
  UNIQUE(user_id, date)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_questions_filters ON questions(exam_board_id, contest_id, subject_id, year, difficulty_level);
CREATE INDEX idx_user_answers_user ON user_answers(user_id, answered_at);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id, start_time);
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_booklets ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view questions" ON questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage questions" ON questions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can only access their own answers" ON user_answers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own error notebook" ON error_notebook FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own booklets" ON generated_booklets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own stats" ON daily_stats FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_materials_updated_at BEFORE UPDATE ON study_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular estatísticas
CREATE OR REPLACE FUNCTION calculate_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_questions INTEGER,
  correct_answers INTEGER,
  accuracy DECIMAL,
  total_study_time INTEGER,
  favorite_subject VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(ua.id)::INTEGER as total_questions,
    SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::INTEGER as correct_answers,
    ROUND(
      CASE 
        WHEN COUNT(ua.id) > 0 THEN 
          SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(ua.id) * 100 
        ELSE 0 
      END, 2
    ) as accuracy,
    COALESCE(SUM(ss.duration_minutes), 0)::INTEGER as total_study_time,
    (
      SELECT s.name 
      FROM user_answers ua2
      JOIN questions q2 ON ua2.question_id = q2.id
      JOIN subjects s ON q2.subject_id = s.id
      WHERE ua2.user_id = user_uuid
      GROUP BY s.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_subject
  FROM user_answers ua
  LEFT JOIN study_sessions ss ON ss.user_id = user_uuid
  WHERE ua.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;