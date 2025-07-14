import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, BarChart3, Users, Zap, Shield, CheckCircle, Star } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  const handleRecruiterClick = () => {
    navigate('/recruiter');
  };

  const handleCandidateClick = () => {
    navigate('/candidate');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              AI-Powered Smart
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block mt-2">
                Recruiting System
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 text-indigo-100 max-w-4xl mx-auto leading-relaxed px-4">
              Transform your hiring process with advanced psychometric testing and personality analysis. 
              Make data-driven decisions and find the perfect cultural fit for your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button 
                onClick={handleRecruiterClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>For Recruiters</span>
              </button>
              <button 
                onClick={handleCandidateClick}
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>For Candidates</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Revolutionary Recruiting Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our AI-powered platform combines cutting-edge technology with human insights to deliver exceptional hiring results.
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">AI-Generated Psychometric Tests</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Dynamic psychological assessments tailored to specific job roles, providing deep insights into candidate personality and work style.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Role-specific question generation
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Big Five personality analysis
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Cultural fit assessment
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 sm:p-8 rounded-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">GitHub Profile Analysis</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Comprehensive technical assessment through GitHub activity analysis, code quality evaluation, and collaboration patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Code quality analysis
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Technology stack evaluation
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Collaboration assessment
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 sm:p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Comprehensive Analytics Dashboard</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Visual reports combining psychometric results and technical analysis for data-driven hiring decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Interactive candidate profiles
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Comparative analysis tools
                </li>
                <li className="flex items-center text-gray-600 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Interview recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Proven Results That Matter
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Companies using Trait-Tracer see dramatic improvements in their hiring process
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">85%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Reduction in screening time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">92%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Improvement in hire quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-violet-600 mb-2">78%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Increase in retention rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 mb-2">10x</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Faster hiring decisions</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How Trait-Tracer Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Simple, powerful, and designed for modern recruiting teams
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">1. Create Job Opening</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Post your job requirements and let our AI customize the assessment process
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">2. Candidates Apply</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Candidates complete psychometric tests and provide their GitHub profiles
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Brain className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">3. AI Analysis</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Our AI analyzes personality traits, technical skills, and cultural fit
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">4. Get Insights</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Receive comprehensive reports and make data-driven hiring decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Trusted by leading companies worldwide
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                "Trait-Tracer revolutionized our hiring process. We've reduced our time-to-hire by 60% while significantly improving the quality of our candidates."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Johnson</div>
                  <div className="text-gray-600 text-xs sm:text-sm">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                "The personality insights are incredibly accurate. We've made better hiring decisions and our team culture has never been stronger."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Michael Chen</div>
                  <div className="text-gray-600 text-xs sm:text-sm">CEO, StartupXYZ</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                "The GitHub analysis feature is a game-changer for technical roles. We can assess coding skills before even scheduling an interview."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Emily Rodriguez</div>
                  <div className="text-gray-600 text-xs sm:text-sm">CTO, DevCompany</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 lg:mb-12 text-indigo-100 px-4">
            Join thousands of companies using Trait-Tracer to make smarter hiring decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button 
              onClick={handleRecruiterClick}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>For Recruiters</span>
            </button>
            <button 
              onClick={handleCandidateClick}
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>For Candidates</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold">Trait-Tracer</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                AI-powered recruiting platform that transforms how companies hire top talent.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2024 Trait-Tracer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;