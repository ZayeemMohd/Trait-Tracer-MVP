class StorageService {
  constructor() {
    this.keys = {
      JOB_OPENINGS: 'trait_tracer_job_openings',
      CANDIDATES: 'trait_tracer_candidates',
      TEST_RESULTS: 'trait_tracer_test_results',
      USER_PREFERENCES: 'trait_tracer_user_preferences'
    };
  }

  // Generic storage methods
  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Job Openings methods
  saveJobOpenings(jobOpenings) {
    return this.setItem(this.keys.JOB_OPENINGS, jobOpenings);
  }

  getJobOpenings() {
    return this.getItem(this.keys.JOB_OPENINGS, []);
  }

  addJobOpening(jobOpening) {
    const jobOpenings = this.getJobOpenings();
    const newJobOpening = {
      ...jobOpening,
      id: Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    jobOpenings.push(newJobOpening);
    this.saveJobOpenings(jobOpenings);
    return newJobOpening;
  }

  updateJobOpening(id, updates) {
    const jobOpenings = this.getJobOpenings();
    const index = jobOpenings.findIndex(job => job.id === id);
    if (index !== -1) {
      jobOpenings[index] = { ...jobOpenings[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveJobOpenings(jobOpenings);
      return jobOpenings[index];
    }
    return null;
  }

  deleteJobOpening(id) {
    const jobOpenings = this.getJobOpenings();
    const filteredJobs = jobOpenings.filter(job => job.id !== id);
    this.saveJobOpenings(filteredJobs);
    return filteredJobs.length < jobOpenings.length;
  }

  // Candidates methods
  saveCandidates(candidates) {
    return this.setItem(this.keys.CANDIDATES, candidates);
  }

  getCandidates() {
    return this.getItem(this.keys.CANDIDATES, []);
  }

  addCandidate(candidate) {
    const candidates = this.getCandidates();
    const newCandidate = {
      ...candidate,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      appliedJobs: candidate.appliedJobs || [],
      testResults: candidate.testResults || {}
    };
    candidates.push(newCandidate);
    this.saveCandidates(candidates);
    return newCandidate;
  }

  updateCandidate(id, updates) {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(candidate => candidate.id === id);
    if (index !== -1) {
      candidates[index] = { ...candidates[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveCandidates(candidates);
      return candidates[index];
    }
    return null;
  }

  updateCandidateTestResults(candidateId, testResults) {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(candidate => candidate.id === candidateId);
    if (index !== -1) {
      candidates[index].testResults = { ...candidates[index].testResults, ...testResults };
      candidates[index].updatedAt = new Date().toISOString();
      this.saveCandidates(candidates);
      return candidates[index];
    }
    return null;
  }

  // Test Results methods
  saveTestResults(testResults) {
    return this.setItem(this.keys.TEST_RESULTS, testResults);
  }

  getTestResults() {
    return this.getItem(this.keys.TEST_RESULTS, []);
  }

  addTestResult(testResult) {
    const testResults = this.getTestResults();
    const newTestResult = {
      ...testResult,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    testResults.push(newTestResult);
    this.saveTestResults(testResults);
    return newTestResult;
  }

  // User Preferences methods
  saveUserPreferences(preferences) {
    return this.setItem(this.keys.USER_PREFERENCES, preferences);
  }

  getUserPreferences() {
    return this.getItem(this.keys.USER_PREFERENCES, {
      theme: 'light',
      notifications: true,
      autoSave: true,
      language: 'en'
    });
  }

  updateUserPreferences(updates) {
    const preferences = this.getUserPreferences();
    const newPreferences = { ...preferences, ...updates };
    this.saveUserPreferences(newPreferences);
    return newPreferences;
  }

  // Utility methods
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      this.removeItem(key);
    });
  }

  exportData() {
    const data = {
      jobOpenings: this.getJobOpenings(),
      candidates: this.getCandidates(),
      testResults: this.getTestResults(),
      userPreferences: this.getUserPreferences(),
      exportedAt: new Date().toISOString()
    };
    return data;
  }

  importData(data) {
    try {
      if (data.jobOpenings) this.saveJobOpenings(data.jobOpenings);
      if (data.candidates) this.saveCandidates(data.candidates);
      if (data.testResults) this.saveTestResults(data.testResults);
      if (data.userPreferences) this.saveUserPreferences(data.userPreferences);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Analytics methods
  getAnalytics() {
    const jobOpenings = this.getJobOpenings();
    const candidates = this.getCandidates();
    const testResults = this.getTestResults();

    return {
      totalJobs: jobOpenings.length,
      totalCandidates: candidates.length,
      completedTests: candidates.filter(c => c.testResults?.completed).length,
      averageScore: this.calculateAverageScore(candidates),
      topPerformers: this.getTopPerformers(candidates),
      recentActivity: this.getRecentActivity(candidates, jobOpenings)
    };
  }

  calculateAverageScore(candidates) {
    const completedTests = candidates.filter(c => c.testResults?.completed && c.testResults?.overallScore);
    if (completedTests.length === 0) return 0;
    
    const totalScore = completedTests.reduce((sum, candidate) => {
      return sum + (candidate.testResults.overallScore || candidate.testResults.score || 0);
    }, 0);
    
    return Math.round(totalScore / completedTests.length);
  }

  getTopPerformers(candidates, limit = 5) {
    return candidates
      .filter(c => c.testResults?.completed && c.testResults?.overallScore)
      .sort((a, b) => (b.testResults.overallScore || b.testResults.score || 0) - (a.testResults.overallScore || a.testResults.score || 0))
      .slice(0, limit);
  }

  getRecentActivity(candidates, jobOpenings, days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentCandidates = candidates.filter(c => 
      new Date(c.createdAt || 0) > cutoffDate
    );

    const recentJobs = jobOpenings.filter(j => 
      new Date(j.createdAt || 0) > cutoffDate
    );

    return {
      newCandidates: recentCandidates.length,
      newJobs: recentJobs.length,
      completedTests: recentCandidates.filter(c => c.testResults?.completed).length
    };
  }
}

export default new StorageService();