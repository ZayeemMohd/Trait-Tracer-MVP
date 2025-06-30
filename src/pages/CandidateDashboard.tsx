import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, DollarSign, Users, Search, Filter, ArrowRight } from 'lucide-react';

function CandidateDashboard() {
  const { jobOpenings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExperience = filterExperience === 'all' || job.experience === filterExperience;
    const matchesType = filterType === 'all' || job.type === filterType;
    
    return matchesSearch && matchesExperience && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Job</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover opportunities that match your skills and personality</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm min-w-0 sm:min-w-[180px]"
              >
                <option value="all">All Experience Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm min-w-0 sm:min-w-[150px]"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {filteredJobs.length} of {jobOpenings.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid gap-4 sm:gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-indigo-600 font-medium mb-2 text-sm sm:text-base">{job.company}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2 text-sm sm:text-base">{job.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      job.experience === 'Entry' ? 'bg-green-100 text-green-800' :
                      job.experience === 'Mid' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.experience} Level
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{job.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{job.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{job.salary || 'Competitive'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Posted {job.postedDate}</span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-500 mr-2 flex-shrink-0">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t space-y-3 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Apply now to start your AI-powered assessment
                  </div>
                  <Link
                    to={`/apply/${job.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;