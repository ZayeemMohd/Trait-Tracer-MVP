/*
  # Fix RLS Policies for Authentication

  1. Security Updates
    - Add proper INSERT policies for recruiters and candidates tables
    - Allow authenticated users to create their own profiles
    - Fix existing policies to work with auth.uid()
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Recruiters can read own data" ON recruiters;
DROP POLICY IF EXISTS "Recruiters can update own data" ON recruiters;
DROP POLICY IF EXISTS "Candidates can read own data" ON candidates;
DROP POLICY IF EXISTS "Candidates can update own data" ON candidates;

-- Recruiters policies
CREATE POLICY "Recruiters can insert own data"
  ON recruiters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Recruiters can read own data"
  ON recruiters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Recruiters can update own data"
  ON recruiters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Candidates policies
CREATE POLICY "Candidates can insert own data"
  ON candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Candidates can read own data"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Candidates can update own data"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);