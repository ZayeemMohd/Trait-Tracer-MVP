import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storageService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    const initializeData = () => {
      try {
        // Load data from localStorage
        const savedJobs = storageService.getJobOpenings();
        const savedCandidates = storageService.getCandidates();

        if (savedJobs.length > 0) {
          setJobOpenings(savedJobs);
        } else {
          // Initialize with mock data if no saved data exists
          const mockJobs = [
            {
              id: 1,
              title: "Senior Frontend Developer",
              company: "TechCorp Solutions",
              description: "We're looking for a skilled frontend developer to join our dynamic team. You'll be working on cutting-edge web applications using React, TypeScript, and modern development practices.",
              requirements: ["5+ years React experience", "TypeScript proficiency", "UI/UX design skills"],
              skills: ["React", "TypeScript", "CSS", "JavaScript", "UI/UX"],
              experience: "Senior",
              type: "Full-time",
              location: "San Francisco, CA",
              salary: "$120,000 - $150,000",
              postedDate: "2024-01-15",
              recruiterID: "rec_001",
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              title: "Data Scientist",
              company: "DataFlow Analytics",
              description: "Join our AI research team to develop machine learning models and data-driven solutions. Work with large datasets and cutting-edge ML frameworks.",
              requirements: ["Python expertise", "Machine Learning experience", "Statistics background"],
              skills: ["Python", "TensorFlow", "SQL", "Statistics", "Machine Learning"],
              experience: "Mid",
              type: "Full-time",
              location: "Remote",
              salary: "$90,000 - $120,000",
              postedDate: "2024-01-12",
              recruiterID: "rec_002",
              createdAt: new Date().toISOString()
            },
            {
              id: 3,
              title: "Product Manager",
              company: "Innovation Labs",
              description: "Lead cross-functional teams to deliver world-class products. Drive product strategy, roadmap planning, and feature development.",
              requirements: ["3+ years product management", "Agile methodologies", "Data analysis skills"],
              skills: ["Product Strategy", "Agile", "Analytics", "Leadership", "Communication"],
              experience: "Mid",
              type: "Full-time",
              location: "New York, NY",
              salary: "$100,000 - $130,000",
              postedDate: "2024-01-10",
              recruiterID: "rec_001",
              createdAt: new Date().toISOString()
            },
            {
              id: 4,
              title: "DevOps Engineer",
              company: "CloudTech Systems",
              description: "Manage cloud infrastructure and deployment pipelines. Ensure scalability, reliability, and security of our platform.",
              requirements: ["AWS/Azure experience", "Docker/Kubernetes", "CI/CD pipelines"],
              skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
              experience: "Mid",
              type: "Full-time",
              location: "Austin, TX",
              salary: "$95,000 - $125,000",
              postedDate: "2024-01-08",
              recruiterID: "rec_003",
              createdAt: new Date().toISOString()
            }
          ];
          setJobOpenings(mockJobs);
          storageService.saveJobOpenings(mockJobs);
        }

        if (savedCandidates.length > 0) {
          setCandidates(savedCandidates);
        } else {
          // Initialize with mock candidates if no saved data exists
          const mockCandidates = [
            {
              id: 1,
              personalInfo: {
                fullName: "Alex Chen",
                email: "alex.chen@email.com",
                phone: "(555) 123-4567",
                location: "San Francisco, CA",
                githubUsername: "alexchen-dev"
              },
              appliedJobs: [1],
              testResults: {
                jobId: 1,
                completed: true,
                score: 85,
                overallScore: 85,
                personalityTraits: {
                  openness: 78,
                  conscientiousness: 92,
                  extraversion: 65,
                  agreeableness: 88,
                  neuroticism: 32
                },
                strengths: ["Problem-solving", "Team collaboration", "Technical innovation"],
                developmentAreas: ["Public speaking", "Delegation skills"],
                culturalFit: 8.5,
                technicalMindset: 9.0,
                leadershipPotential: 7.5,
                stressResilience: 8.2,
                recommendations: "Excellent technical skills with strong collaborative mindset. Ideal for senior development roles.",
                interviewFocus: ["Technical architecture", "Team leadership", "Project management"],
                riskFactors: ["May need support with public presentations"]
              },
              githubAnalysis: {
                repositories: 24,
                languages: ["JavaScript", "TypeScript", "Python", "Go"],
                contributions: 1250,
                activeProjects: 8,
                qualityScore: 88
              },
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              personalInfo: {
                fullName: "Sarah Johnson",
                email: "sarah.johnson@email.com",
                phone: "(555) 987-6543",
                location: "Remote",
                githubUsername: "sarah-data"
              },
              appliedJobs: [2],
              testResults: {
                jobId: 2,
                completed: true,
                score: 91,
                overallScore: 91,
                personalityTraits: {
                  openness: 95,
                  conscientiousness: 89,
                  extraversion: 45,
                  agreeableness: 75,
                  neuroticism: 28
                },
                strengths: ["Analytical thinking", "Data interpretation", "Research methodology"],
                developmentAreas: ["Team communication", "Presentation skills"],
                culturalFit: 9.2,
                technicalMindset: 9.5,
                leadershipPotential: 6.8,
                stressResilience: 8.7,
                recommendations: "Outstanding analytical capabilities with strong research background. Perfect fit for data science roles.",
                interviewFocus: ["Statistical modeling", "Data visualization", "Research methodology"],
                riskFactors: ["May prefer independent work over team collaboration"]
              },
              githubAnalysis: {
                repositories: 18,
                languages: ["Python", "R", "SQL", "Julia"],
                contributions: 890,
                activeProjects: 5,
                qualityScore: 92
              },
              createdAt: new Date().toISOString()
            }
          ];
          setCandidates(mockCandidates);
          storageService.saveCandidates(mockCandidates);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (!loading && jobOpenings.length > 0) {
      storageService.saveJobOpenings(jobOpenings);
    }
  }, [jobOpenings, loading]);

  useEffect(() => {
    if (!loading && candidates.length > 0) {
      storageService.saveCandidates(candidates);
    }
  }, [candidates, loading]);

  const addJobOpening = (job) => {
    const newJob = storageService.addJobOpening(job);
    setJobOpenings(prev => [...prev, newJob]);
    return newJob;
  };

  const updateJobOpening = (id, updates) => {
    const updatedJob = storageService.updateJobOpening(id, updates);
    if (updatedJob) {
      setJobOpenings(prev => prev.map(job => job.id === id ? updatedJob : job));
    }
    return updatedJob;
  };

  const deleteJobOpening = (id) => {
    const success = storageService.deleteJobOpening(id);
    if (success) {
      setJobOpenings(prev => prev.filter(job => job.id !== id));
    }
    return success;
  };

  const addCandidate = (candidate) => {
    const newCandidate = storageService.addCandidate(candidate);
    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  };

  const updateCandidate = (id, updates) => {
    const updatedCandidate = storageService.updateCandidate(id, updates);
    if (updatedCandidate) {
      setCandidates(prev => prev.map(candidate => candidate.id === id ? updatedCandidate : candidate));
    }
    return updatedCandidate;
  };

  const updateCandidateTestResults = (candidateId, testResults) => {
    const updatedCandidate = storageService.updateCandidateTestResults(candidateId, testResults);
    if (updatedCandidate) {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId ? updatedCandidate : candidate
      ));
    }
    return updatedCandidate;
  };

  const getAnalytics = () => {
    return storageService.getAnalytics();
  };

  const exportData = () => {
    return storageService.exportData();
  };

  const importData = (data) => {
    const success = storageService.importData(data);
    if (success) {
      // Refresh state from storage
      setJobOpenings(storageService.getJobOpenings());
      setCandidates(storageService.getCandidates());
    }
    return success;
  };

  const clearAllData = () => {
    storageService.clearAllData();
    setJobOpenings([]);
    setCandidates([]);
  };

  const value = {
    jobOpenings,
    candidates,
    currentUser,
    loading,
    setCurrentUser,
    addJobOpening,
    updateJobOpening,
    deleteJobOpening,
    addCandidate,
    updateCandidate,
    updateCandidateTestResults,
    getAnalytics,
    exportData,
    importData,
    clearAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}