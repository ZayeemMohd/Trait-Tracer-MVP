import React, { useState } from 'react';
import { db } from '../lib/supabase';
import { X, Plus } from 'lucide-react';

function JobCreationModal({ organizationId, onClose, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    required_skills: [''],
    experience: 'Mid',
    type: 'Full-time',
    location: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jobData = {
        organization_id: organizationId,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        required_skills: formData.required_skills.filter(skill => skill.trim() !== ''),
        experience_level: formData.experience,
        employment_type: formData.type,
        location: formData.location || null,
        salary_range: formData.salary || null,
        is_active: true
      };

      const { data, error } = await db.createJobOpening(jobData);
      if (error) throw error;

      // Refresh the job list
      if (onJobCreated) {
        await onJobCreated();
      }
      
      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Error creating job opening:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOld = (e) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      required_skills: formData.required_skills.filter(skill => skill.trim() !== '')
    };
    // addJobOpening(jobData);
    onClose();
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      required_skills: [...prev.required_skills, '']
    }));
  };

  const updateSkill = (index, value) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Job Opening</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter requirement"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            {formData.required_skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter skill"
                />
                {formData.required_skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., $80,000 - $120,000"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Job Opening</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobCreationModal;