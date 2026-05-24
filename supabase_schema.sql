-- MindSteps Database Schema
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age_group TEXT NOT NULL DEFAULT '11-14',
  grade TEXT DEFAULT '6',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_study_date DATE,
  tutor_id TEXT DEFAULT 'default',
  pet_type TEXT,
  pet_name TEXT,
  pet_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
  tutor_id TEXT DEFAULT 'default',
  subject TEXT DEFAULT 'geral',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES study_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily usage tracking
CREATE TABLE IF NOT EXISTS daily_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  message_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_profile_id ON study_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON daily_usage(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can access own data" ON users
  FOR ALL USING (auth.uid()::integer = id);

CREATE POLICY "Users can access own profile" ON student_profiles
  FOR ALL USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can access own sessions" ON study_sessions
  FOR ALL USING (
    profile_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid()::integer)
  );

CREATE POLICY "Users can access own messages" ON chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT s.id FROM study_sessions s
      JOIN student_profiles p ON s.profile_id = p.id
      WHERE p.user_id = auth.uid()::integer
    )
  );

CREATE POLICY "Users can access own usage" ON daily_usage
  FOR ALL USING (auth.uid()::integer = user_id);

-- For development/testing without Supabase Auth, use this instead:
-- Disable RLS for now (enable after setting up Supabase Auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage DISABLE ROW LEVEL SECURITY;