/*
  # Evedentia Database Schema

  1. New Tables
    - `cases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `case_name` (text)
      - `case_number` (text, unique)
      - `description` (text)
      - `status` (text - active, closed, archived)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `case_files`
      - `id` (uuid, primary key)
      - `case_id` (uuid, references cases)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `storage_path` (text)
      - `uploaded_at` (timestamptz)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `organization` (text)
      - `role` (text - investigator, officer, admin)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Restrict case access to case owners only
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  organization text DEFAULT '',
  role text DEFAULT 'investigator' CHECK (role IN ('investigator', 'officer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_name text NOT NULL,
  case_number text UNIQUE NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cases"
  ON cases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cases"
  ON cases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cases"
  ON cases FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cases"
  ON cases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create case_files table
CREATE TABLE IF NOT EXISTS case_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text DEFAULT '',
  file_size bigint DEFAULT 0,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files of own cases"
  ON case_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_files.case_id
      AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload files to own cases"
  ON case_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_files.case_id
      AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files from own cases"
  ON case_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_files.case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_case_files_case_id ON case_files(case_id);
