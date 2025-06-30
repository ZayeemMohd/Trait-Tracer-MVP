import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Github, Award, Target, Eye, Filter, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

function CandidateAnalytics() {
  const { candidates, jobOpenings } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterJob, setFilterJob] = useState('all');

  const filteredCandidates = filterJob === 'all' 
    ? candidates 
    : candidates.filter(candidate => candidate.appliedJobs.includes(parseInt(filterJob)));

  const getJobTitle = (jobId) => {
    const job = jobOpenings.find(job => job.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  const PersonalityRadarChart = ({ traits }) => {
    const maxValue = 100;
    const center = 100;
    const radius = 80;
    
    const points = Object.entries(traits).map(([trait, value], index) => {
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = (value / maxValue) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, trait, value };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600" />
          AI-Analyzed Personality Profile
        </h4>
        <svg viewBox="0 0 200 200" className="w-full h-48 sm:h-64">
          {/* Grid circles */}
          {[20, 40, 60, 80].map(r => (
            <circle
              key={r}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {points.map((_, index) => {
            const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygon */}
          <path
            d={pathData}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="#6366f1"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#6366f1"
            />
          ))}
          
          {/* Labels */}
          {points.map((point, index) => {
            const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {point.trait}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">AI-Powered Candidate Analytics</h2>
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="all">All Positions</option>
            {jobOpenings.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Candidate List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Candidates ({filteredCandidates.length})</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedCandidate?.id === candidate.id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {candidate.personalInfo.fullName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {getJobTitle(candidate.appliedJobs[0])}
                      </p>
                      {candidate.testResults?.completed && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Brain className="w-3 h-3 text-indigo-500" />
                          <span className="text-xs text-indigo-600 font-medium">
                            AI Score: {candidate.testResults.overallScore || candidate.testResults.score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Details */}
        <div className="lg:col-span-2">
          {selectedCandidate ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Overview Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedCandidate.personalInfo.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedCandidate.personalInfo.email}</p>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedCandidate.personalInfo.location}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                      {selectedCandidate.testResults?.overallScore || selectedCandidate.testResults?.score || 0}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">AI Overall Score</div>
                  </div>
                </div>

                {/* Enhanced Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Github className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {selectedCandidate.githubAnalysis?.repositories || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Repositories</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-base sm:text-lg font-semibold text-blue-900">
                      {selectedCandidate.testResults?.culturalFit || 'N/A'}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">Cultural Fit</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-base sm:text-lg font-semibold text-green-900">
                      {selectedCandidate.testResults?.technicalMindset || 'N/A'}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600">Technical Mindset</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <Award className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-base sm:text-lg font-semibold text-purple-900">
                      {selectedCandidate.testResults?.leadershipPotential || 'N/A'}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600">Leadership Potential</div>
                  </div>
                </div>
              </div>

              {/* Personality Analysis */}
              {selectedCandidate.testResults?.personalityTraits && (
                <PersonalityRadarChart traits={selectedCandidate.testResults.personalityTraits} />
              )}

              {/* Enhanced Strengths & Development Areas */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-600" />
                    AI-Identified Strengths
                  </h4>
                  <ul className="space-y-2">
                    {(selectedCandidate.testResults?.strengths || []).map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-yellow-600" />
                    Development Areas
                  </h4>
                  <ul className="space-y-2">
                    {(selectedCandidate.testResults?.developmentAreas || []).map((area, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.githubAnalysis?.languages?.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interview Focus Areas */}
              {selectedCandidate.testResults?.interviewFocus && selectedCandidate.testResults.interviewFocus.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-blue-600" />
                    AI-Recommended Interview Focus
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedCandidate.testResults.interviewFocus.map((focus, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-blue-800 font-medium text-sm sm:text-base">{focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {selectedCandidate.testResults?.riskFactors && selectedCandidate.testResults.riskFactors.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-red-600" />
                    Potential Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {selectedCandidate.testResults.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Recommendations */}
              {selectedCandidate.testResults?.recommendations && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600" />
                    Gemini AI Recommendations
                  </h4>
                  <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg text-sm sm:text-base">
                    {selectedCandidate.testResults.recommendations}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
              <Eye className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Select a Candidate</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Choose a candidate from the list to view their detailed AI-powered analytics and test results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateAnalytics;