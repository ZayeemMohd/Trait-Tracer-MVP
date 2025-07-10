/*
  # Initial Schema for Trait-Tracer Application

  1. New Tables
    - `recruiters`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `organizations`
      - `id` (uuid, primary key)
      - `recruiter_id` (uuid, foreign key)
      - `name` (text)
      - `industry` (text)
      - `company_size` (text)
      - `description` (text)
      - `logo_url` (text, optional)
      - `company_website` (text, optional)
      - `company_address` (text, optional)
      - `founded_year` (integer, optional)
      - `employee_count` (text, optional)
      - `company_culture` (text, optional)
      - `benefits` (text[], optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `candidates`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text, optional)
      - `location` (text, optional)
      - `github_username` (text, optional)
      - `linkedin_profile` (text, optional)
      - `portfolio_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `job_openings`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `requirements` (text[])
      - `required_skills` (text[])
      - `experience_level` (text)
      - `employment_type` (text)
      - `location` (text, optional)
      - `salary_range` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `applications`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, foreign key)
      - `job_opening_id` (uuid, foreign key)
      - `status` (text, default 'applied')
      - `applied_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assessments`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key)
      - `questions` (jsonb)
      - `answers` (jsonb)
      - `overall_score` (integer)
      - `skill_scores` (jsonb)
      - `personality_traits` (jsonb)
      - `github_analysis` (jsonb)
      - `ai_recommendations` (text)
      - `cultural_fit` (decimal)
      - `technical_mindset` (decimal)
      - `leadership_potential` (decimal)
      - `stress_resilience` (decimal)
      - `strengths` (text[])
      - `development_areas` (text[])
      - `interview_focus` (text[])
      - `risk_factors` (text[])
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text,
  company_size text,
  description text,
  logo_url text,
  company_website text,
  company_address text,
  founded_year integer,
  employee_count text,
  company_culture text,
  benefits text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  location text,
  github_username text,
  linkedin_profile text,
  portfolio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_openings table
CREATE TABLE IF NOT EXISTS job_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  required_skills text[] DEFAULT '{}',
  experience_level text NOT NULL,
  employment_type text NOT NULL,
  location text,
  salary_range text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(id) ON DELETE CASCADE,
  job_opening_id uuid REFERENCES job_openings(id) ON DELETE CASCADE,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'assessment_completed', 'under_review', 'rejected', 'hired')),
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, job_opening_id)
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  questions jsonb DEFAULT '[]',
  answers jsonb DEFAULT '{}',
  overall_score integer DEFAULT 0,
  skill_scores jsonb DEFAULT '{}',
  personality_traits jsonb DEFAULT '{}',
  github_analysis jsonb DEFAULT '{}',
  ai_recommendations text,
  cultural_fit decimal DEFAULT 0,
  technical_mindset decimal DEFAULT 0,
  leadership_potential decimal DEFAULT 0,
  stress_resilience decimal DEFAULT 0,
  strengths text[] DEFAULT '{}',
  development_areas text[] DEFAULT '{}',
  interview_focus text[] DEFAULT '{}',
  risk_factors text[] DEFAULT '{}',
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for recruiters
CREATE POLICY "Recruiters can read own data"
  ON recruiters
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Recruiters can update own data"
  ON recruiters
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for organizations
CREATE POLICY "Recruiters can read own organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (recruiter_id::text = auth.uid()::text);

CREATE POLICY "Recruiters can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (recruiter_id::text = auth.uid()::text);

CREATE POLICY "Recruiters can update own organizations"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (recruiter_id::text = auth.uid()::text);

CREATE POLICY "Recruiters can delete own organizations"
  ON organizations
  FOR DELETE
  TO authenticated
  USING (recruiter_id::text = auth.uid()::text);

-- Create policies for candidates
CREATE POLICY "Candidates can read own data"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Candidates can update own data"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for job_openings
CREATE POLICY "Anyone can read active job openings"
  ON job_openings
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Recruiters can manage jobs in their organizations"
  ON job_openings
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE recruiter_id::text = auth.uid()::text
    )
  );

-- Create policies for applications
CREATE POLICY "Candidates can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (candidate_id::text = auth.uid()::text);

CREATE POLICY "Candidates can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (candidate_id::text = auth.uid()::text);

CREATE POLICY "Recruiters can read applications for their jobs"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    job_opening_id IN (
      SELECT jo.id FROM job_openings jo
      JOIN organizations o ON jo.organization_id = o.id
      WHERE o.recruiter_id::text = auth.uid()::text
    )
  );

-- Create policies for assessments
CREATE POLICY "Candidates can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE candidate_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Candidates can create assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE candidate_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Recruiters can read assessments for their jobs"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN job_openings jo ON a.job_opening_id = jo.id
      JOIN organizations o ON jo.organization_id = o.id
      WHERE o.recruiter_id::text = auth.uid()::text
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_recruiter_id ON organizations(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_openings_organization_id ON job_openings(organization_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_opening_id ON applications(job_opening_id);
CREATE INDEX IF NOT EXISTS idx_assessments_application_id ON assessments(application_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_openings_updated_at BEFORE UPDATE ON job_openings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();