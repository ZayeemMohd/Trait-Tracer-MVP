import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';
import { Plus, Eye, Users, BarChart3, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import JobCreationModal from '../components/JobCreationModal';
import CandidateAnalytics from '../components/CandidateAnalytics';

function RecruiterDashboard() {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load job openings for this organization
  React.useEffect(() => {
    loadJobOpenings();
  }, [organizationId]);

  const loadJobOpenings = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await db.getOrganizationJobs(organizationId);
      if (error) throw error;
      setJobOpenings(data || []);
    } catch (error) {
      setError('Failed to load job openings');
      console.error('Error loading job openings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsCount = async (jobId) => {
    try {
      const { data, error } = await db.getJobApplications(jobId);
      if (error) throw error;
      return data ? data.length : 0;
    } catch (error) {
      console.error('Error getting applications count:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your job openings and analyze candidate performance</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'jobs'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Job Openings Manager</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Candidate Analytics</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Job Openings Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Job Openings</h2>
              <button
                onClick={() => setShowJobModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Job</span>
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {jobOpenings.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 font-medium text-sm sm:text-base">{job.company}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2 text-sm sm:text-base">{job.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{job.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{job.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Posted {job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs sm:text-sm">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-gray-500 text-xs sm:text-sm">+{job.skills.length - 3} more</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="text-xs sm:text-sm text-gray-600">
                        {getApplicationsCount(job.id)} applications
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm flex items-center space-x-1 self-start sm:self-auto">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <CandidateAnalytics />}

        {/* Job Creation Modal */}
        {showJobModal && (
          <JobCreationModal 
            organizationId={organizationId}
            onClose={() => setShowJobModal(false)}
            onJobCreated={loadJobOpenings}
          />
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;