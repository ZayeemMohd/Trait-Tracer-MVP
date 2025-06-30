import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Github, Mail, Phone, MapPin, GraduationCap, Briefcase, ArrowRight, Loader } from 'lucide-react';
import geminiService from '../services/geminiService';

function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobOpenings, addCandidate } = useApp();
  const job = jobOpenings.find(j => j.id === parseInt(jobId));

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    experience: '',
    githubUsername: '',
    linkedinProfile: '',
    portfolio: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubValidation, setGithubValidation] = useState({ status: '', message: '' });

  const validateGitHubUsername = async (username) => {
    if (!username.trim()) {
      setGithubValidation({ status: '', message: '' });
      return;
    }

    setGithubValidation({ status: 'checking', message: 'Validating GitHub profile...' });
    
    try {
      const githubData = await geminiService.analyzeGitHubProfile(username);
      if (githubData) {
        setGithubValidation({ 
          status: 'valid', 
          message: `✓ Valid profile found: ${githubData.profile.public_repos} repositories, ${githubData.profile.followers} followers` 
        });
      } else {
        setGithubValidation({ 
          status: 'invalid', 
          message: '✗ GitHub profile not found or private' 
        });
      }
    } catch (error) {
      setGithubValidation({ 
        status: 'error', 
        message: '⚠ Unable to validate GitHub profile' 
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.githubUsername.trim()) newErrors.githubUsername = 'GitHub username is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Analyze GitHub profile
      const githubData = await geminiService.analyzeGitHubProfile(formData.githubUsername);
      
      const candidateData = {
        personalInfo: formData,
        appliedJobs: [parseInt(jobId)],
        testResults: {
          completed: false,
          jobId: parseInt(jobId)
        },
        githubAnalysis: githubData ? {
          repositories: githubData.analysis.totalRepos,
          languages: githubData.analysis.languages,
          contributions: githubData.analysis.totalStars + githubData.analysis.totalForks,
          activeProjects: Math.min(githubData.analysis.totalRepos, 10),
          qualityScore: Math.min(90, 60 + (githubData.analysis.totalStars * 2) + (githubData.analysis.totalForks * 3)),
          accountAge: githubData.analysis.accountAge,
          professionalProfile: githubData.analysis.professionalProfile,
          githubProfile: githubData.profile
        } : {
          repositories: 0,
          languages: [],
          contributions: 0,
          activeProjects: 0,
          qualityScore: 0,
          error: 'GitHub profile not accessible'
        }
      };

      addCandidate(candidateData);
      navigate(`/test/${jobId}`);
    } catch (error) {
      console.error('Error processing application:', error);
      // Continue with basic data if GitHub analysis fails
      const candidateData = {
        personalInfo: formData,
        appliedJobs: [parseInt(jobId)],
        testResults: {
          completed: false,
          jobId: parseInt(jobId)
        },
        githubAnalysis: {
          repositories: 0,
          languages: [],
          contributions: 0,
          activeProjects: 0,
          qualityScore: 0,
          error: 'GitHub analysis failed'
        }
      };

      addCandidate(candidateData);
      navigate(`/test/${jobId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full border border-gray-300 rounded-lg px-4 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-sm";
  const errorClasses = "border-red-300 focus:ring-red-500";

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 text-sm sm:text-base">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Info Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-indigo-600 font-medium text-sm sm:text-base">{job.company}</p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">{job.location} • {job.type}</p>
            </div>
            <div className="self-start sm:text-right">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {job.experience} Level
              </span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Application Form</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Please fill out your information. We'll analyze your GitHub profile and create a personalized AI assessment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600" />
                Personal Information
              </h3>
              
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={`${inputClasses} ${errors.fullName ? errorClasses : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`${inputClasses} pl-10 ${errors.email ? errorClasses : ''}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`${inputClasses} pl-10 ${errors.phone ? errorClasses : ''}`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className={`${inputClasses} pl-10 ${errors.location ? errorClasses : ''}`}
                      placeholder="City, State/Country"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600" />
                Professional Background
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      rows={3}
                      value={formData.education}
                      onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      className={`${inputClasses} pl-10`}
                      placeholder="Your educational background, degrees, certifications..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience
                  </label>
                  <textarea
                    rows={3}
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className={inputClasses}
                    placeholder="Brief overview of your work experience..."
                  />
                </div>
              </div>
            </div>

            {/* Professional Profiles */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Github className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600" />
                Professional Profiles
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Username *
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.githubUsername}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, githubUsername: e.target.value }));
                        if (e.target.value.trim()) {
                          const timeoutId = setTimeout(() => validateGitHubUsername(e.target.value), 1000);
                          return () => clearTimeout(timeoutId);
                        }
                      }}
                      className={`${inputClasses} pl-10 ${errors.githubUsername ? errorClasses : ''}`}
                      placeholder="your-github-username"
                    />
                  </div>
                  {errors.githubUsername && <p className="text-red-500 text-sm mt-1">{errors.githubUsername}</p>}
                  
                  {/* GitHub Validation Status */}
                  {githubValidation.message && (
                    <div className={`text-xs mt-1 flex items-center space-x-1 ${
                      githubValidation.status === 'valid' ? 'text-green-600' :
                      githubValidation.status === 'invalid' ? 'text-red-600' :
                      githubValidation.status === 'checking' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {githubValidation.status === 'checking' && <Loader className="w-3 h-3 animate-spin" />}
                      <span>{githubValidation.message}</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    We'll analyze your GitHub profile to assess your technical skills and coding patterns.
                  </p>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinProfile}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                      className={inputClasses}
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                      className={inputClasses}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to AI Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Next Steps Info */}
        <div className="bg-indigo-50 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-900 mb-3">What happens next?</h3>
          <div className="space-y-2 text-indigo-800 text-sm sm:text-base">
            <p>1. Complete the AI-generated psychometric assessment (20 questions tailored to {job.title})</p>
            <p>2. Our Gemini AI analyzes your GitHub profile and coding patterns</p>
            <p>3. Receive instant feedback on your personality fit and technical skills</p>
            <p>4. Get matched with opportunities based on your comprehensive AI profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplication;