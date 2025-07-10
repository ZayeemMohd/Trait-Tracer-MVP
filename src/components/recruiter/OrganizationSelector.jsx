import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/supabase';
import { Plus, Building, Users, Calendar, ArrowRight, Loader } from 'lucide-react';

function OrganizationSelector() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, [user]);

  const loadOrganizations = async () => {
    if (!user) return;

    try {
      const { data, error } = await db.getRecruiterOrganizations(user.id);
      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      setError('Failed to load organizations');
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationClick = (orgId) => {
    navigate(`/recruiter/organization/${orgId}`);
  };

  const handleCreateOrganization = () => {
    navigate('/recruiter/create-organization');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Organizations</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your recruiting organizations and job postings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Create Organization Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCreateOrganization}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Organization</span>
          </button>
        </div>

        {/* Organizations Grid */}
        {organizations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => handleOrganizationClick(org.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={`${org.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover mb-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                        <Building className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{org.name}</h3>
                    {org.industry && (
                      <p className="text-sm text-gray-600 mb-2">{org.industry}</p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>

                {org.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{org.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {org.company_size && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{org.company_size}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Organizations Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first organization to start posting jobs and managing candidates.
            </p>
            <button
              onClick={handleCreateOrganization}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Organization</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizationSelector;