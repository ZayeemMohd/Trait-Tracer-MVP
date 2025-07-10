import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // Recruiters
  createRecruiter: async (recruiterData) => {
    const { data, error } = await supabase
      .from('recruiters')
      .insert([recruiterData])
      .select()
      .single();
    return { data, error };
  },

  getRecruiter: async (id) => {
    const { data, error } = await supabase
      .from('recruiters')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return { data, error };
  },

  updateRecruiter: async (id, updates) => {
    const { data, error } = await supabase
      .from('recruiters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Organizations
  createOrganization: async (organizationData) => {
    const { data, error } = await supabase
      .from('organizations')
      .insert([organizationData])
      .select()
      .single();
    return { data, error };
  },

  getRecruiterOrganizations: async (recruiterId) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getOrganization: async (id) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateOrganization: async (id, updates) => {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Candidates
  createCandidate: async (candidateData) => {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidateData])
      .select()
      .single();
    return { data, error };
  },

  getCandidate: async (id) => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return { data, error };
  },

  updateCandidate: async (id, updates) => {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Job Openings
  createJobOpening: async (jobData) => {
    const { data, error } = await supabase
      .from('job_openings')
      .insert([jobData])
      .select()
      .single();
    return { data, error };
  },

  getOrganizationJobs: async (organizationId) => {
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getAllActiveJobs: async () => {
    const { data, error } = await supabase
      .from('job_openings')
      .select(`
        *,
        organizations (
          name,
          industry,
          logo_url
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getJobOpening: async (id) => {
    const { data, error } = await supabase
      .from('job_openings')
      .select(`
        *,
        organizations (
          name,
          industry,
          logo_url,
          company_website
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateJobOpening: async (id, updates) => {
    const { data, error } = await supabase
      .from('job_openings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Applications
  createApplication: async (applicationData) => {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    return { data, error };
  },

  getCandidateApplications: async (candidateId) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_openings (
          title,
          description,
          organizations (
            name,
            logo_url
          )
        ),
        assessments (
          overall_score,
          completed_at
        )
      `)
      .eq('candidate_id', candidateId)
      .order('applied_at', { ascending: false });
    return { data, error };
  },

  getJobApplications: async (jobId) => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        candidates (
          full_name,
          email,
          location,
          github_username
        ),
        assessments (
          overall_score,
          skill_scores,
          personality_traits,
          github_analysis,
          ai_recommendations,
          cultural_fit,
          technical_mindset,
          leadership_potential,
          stress_resilience,
          strengths,
          development_areas,
          interview_focus,
          risk_factors,
          completed_at
        )
      `)
      .eq('job_opening_id', jobId)
      .order('applied_at', { ascending: false });
    return { data, error };
  },

  getApplication: async (candidateId, jobId) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('candidate_id', candidateId)
      .eq('job_opening_id', jobId)
      .single();
    return { data, error };
  },

  updateApplication: async (id, updates) => {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Assessments
  createAssessment: async (assessmentData) => {
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentData])
      .select()
      .single();
    return { data, error };
  },

  getAssessment: async (applicationId) => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('application_id', applicationId)
      .single();
    return { data, error };
  },

  updateAssessment: async (id, updates) => {
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Analytics
  getOrganizationAnalytics: async (organizationId) => {
    const { data: jobs, error: jobsError } = await supabase
      .from('job_openings')
      .select('id')
      .eq('organization_id', organizationId);

    if (jobsError) return { data: null, error: jobsError };

    const jobIds = jobs.map(job => job.id);

    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        *,
        assessments (
          overall_score,
          completed_at
        )
      `)
      .in('job_opening_id', jobIds);

    return { data: applications, error: appsError };
  }
};