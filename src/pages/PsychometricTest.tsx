import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle, Brain, BarChart3, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import geminiService from '../services/geminiService';

function PsychometricTest() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobOpenings, candidates, updateCandidateTestResults } = useApp();
  const job = jobOpenings.find(j => j.id === parseInt(jobId));
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  // Load questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      if (job) {
        setLoading(true);
        try {
          const generatedQuestions = await geminiService.generatePsychometricQuestions(
            job.title, 
            job.description
          );
          setQuestions(generatedQuestions);
        } catch (error) {
          console.error('Error loading questions:', error);
          // Fallback questions will be used automatically by the service
          setQuestions(geminiService.getFallbackQuestions(job.title));
        } finally {
          setLoading(false);
        }
      }
    };

    loadQuestions();
  }, [job]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitTest();
    }
  }, [timeLeft, showResults, loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitTest = async () => {
    setEvaluating(true);
    
    try {
      // Get candidate info
      const candidate = candidates.find(c => c.appliedJobs.includes(parseInt(jobId)));
      const candidateInfo = candidate ? candidate.personalInfo : {
        fullName: 'Test Candidate',
        location: 'Unknown',
        githubUsername: 'test-user'
      };

      // Use Gemini to evaluate the candidate
      const evaluation = await geminiService.evaluateCandidate(
        job.title,
        job.description,
        questions,
        answers,
        candidateInfo
      );

      // Ensure we have the correct structure for backward compatibility
      const results = {
        jobId: parseInt(jobId),
        completed: true,
        score: evaluation.overallScore || evaluation.score || 0,
        overallScore: evaluation.overallScore || evaluation.score || 0,
        personalityTraits: evaluation.personalityTraits || {},
        strengths: evaluation.strengths || [],
        developmentAreas: evaluation.developmentAreas || [],
        recommendations: evaluation.recommendations || 'No recommendations available',
        culturalFit: evaluation.culturalFit || 0,
        technicalMindset: evaluation.technicalMindset || 0,
        leadershipPotential: evaluation.leadershipPotential || 0,
        stressResilience: evaluation.stressResilience || 0,
        interviewFocus: evaluation.interviewFocus || [],
        riskFactors: evaluation.riskFactors || [],
        completedAt: new Date().toISOString()
      };

      setTestResults(results);
      setShowResults(true);

      // Update candidate record
      if (candidate) {
        updateCandidateTestResults(candidate.id, results);
      }
    } catch (error) {
      console.error('Error evaluating candidate:', error);
      // Fallback evaluation
      const fallbackResults = geminiService.getFallbackEvaluation(answers, questions.length);
      fallbackResults.jobId = parseInt(jobId);
      setTestResults(fallbackResults);
      setShowResults(true);
      
      if (candidate) {
        updateCandidateTestResults(candidate.id, fallbackResults);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const answeredQuestions = Object.keys(answers).length;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Generating Your Assessment</h2>
          <p className="text-gray-600 text-sm sm:text-base">AI is creating personalized questions for {job.title}...</p>
        </div>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Brain className="w-16 h-16 text-indigo-600 animate-pulse mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">AI is Evaluating Your Responses</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">Please wait while we analyze your psychometric profile...</p>
          <div className="inline-flex items-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm text-gray-500">This may take a few moments</span>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI Assessment Complete!</h1>
              <p className="text-gray-600 text-sm sm:text-base">Your psychometric profile has been analyzed by Gemini AI</p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6 sm:mb-8">
              <div className="text-center p-4 sm:p-6 bg-indigo-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-2">
                  {testResults.overallScore || testResults.score}%
                </div>
                <div className="text-gray-600 text-sm sm:text-base">Overall Match Score</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  {testResults.culturalFit || 'N/A'}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">Cultural Fit Score</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                  {answeredQuestions}/{questions.length}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">Questions Completed</div>
              </div>
            </div>

            {/* Personality Profile */}
            {testResults.personalityTraits && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">AI-Analyzed Personality Profile</h3>
                <div className="space-y-4">
                  {Object.entries(testResults.personalityTraits).map(([trait, score]) => (
                    <div key={trait}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {trait.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-600">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Strengths */}
            {testResults.strengths && testResults.strengths.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Key Strengths Identified</h3>
                <ul className="space-y-2">
                  {testResults.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Development Areas */}
            {testResults.developmentAreas && testResults.developmentAreas.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Development Areas</h3>
                <ul className="space-y-2">
                  {testResults.developmentAreas.map((area, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm sm:text-base">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Recommendations */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">AI Recruiter Assessment</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg text-sm sm:text-base">
                {testResults.recommendations}
              </p>
            </div>

            {/* Interview Focus Areas */}
            {testResults.interviewFocus && testResults.interviewFocus.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recommended Interview Focus</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {testResults.interviewFocus.map((focus, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-blue-800 font-medium text-sm sm:text-base">{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate('/candidate')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Return to Job Board
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">AI-Generated Psychometric Assessment</h1>
              <p className="text-gray-600 text-sm sm:text-base">{job.title} at {job.company}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-600">
                <Brain className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">Gemini AI</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{currentQuestion + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Question {currentQuestion + 1}
                </h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start">
                  {questions[currentQuestion].category}
                </span>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {questions[currentQuestion].question}
              </p>
            </div>

            <div className="space-y-3 mb-6 sm:mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    answers[questions[currentQuestion].id] === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestion].id}`}
                    value={index}
                    checked={answers[questions[currentQuestion].id] === index}
                    onChange={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                      answers[questions[currentQuestion].id] === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[questions[currentQuestion].id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">{option}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
                <span className="text-sm text-gray-600">
                  {answeredQuestions} of {questions.length} answered
                </span>
                
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Complete Assessment</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-indigo-50 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold text-indigo-900 mb-3">AI Assessment Instructions</h3>
          <ul className="space-y-2 text-indigo-800 text-sm sm:text-base">
            <li>• Questions are dynamically generated by Gemini AI based on the {job.title} role</li>
            <li>• Answer honestly based on your natural preferences and work style</li>
            <li>• AI will analyze your responses to create a comprehensive personality profile</li>
            <li>• You have {formatTime(timeLeft)} remaining to complete the assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PsychometricTest;