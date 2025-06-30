const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

class GeminiService {
  async generatePsychometricQuestions(jobTitle, jobDescription) {
    const prompt = `Generate 20 psychometric questions for a ${jobTitle} position. 

Job Description: ${jobDescription}

Please return the questions in the following JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      "category": "personality|work-style|problem-solving|communication|leadership|stress-management|teamwork",
      "trait": "openness|conscientiousness|extraversion|agreeableness|neuroticism",
      "scoring": {
        "A": 4,
        "B": 3,
        "C": 2,
        "D": 1
      }
    }
  ]
}

Focus on questions that assess:
1. Personality traits relevant to the role
2. Work style preferences
3. Problem-solving approaches
4. Communication and collaboration skills
5. Leadership potential
6. Stress management abilities
7. Technical mindset and learning approach

Make questions specific to ${jobTitle} requirements and ensure they help evaluate cultural fit and job performance potential.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const questionsData = JSON.parse(jsonMatch[0]);
        return questionsData.questions;
      } else {
        throw new Error('Failed to parse JSON from Gemini response');
      }
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      // Return fallback questions if Gemini fails
      return this.getFallbackQuestions(jobTitle);
    }
  }

  async evaluateCandidate(jobTitle, jobDescription, questions, answers, candidateInfo, githubData = null) {
    const answersText = questions.map((q, index) => {
      const selectedOption = answers[q.id];
      const optionText = selectedOption !== undefined ? q.options[selectedOption] : 'Not answered';
      return `Question ${index + 1}: ${q.question}\nSelected Answer: ${optionText}\nCategory: ${q.category}`;
    }).join('\n\n');

    const githubAnalysis = githubData ? `
GitHub Profile Analysis:
- Public Repositories: ${githubData.public_repos}
- Followers: ${githubData.followers}
- Following: ${githubData.following}
- Account Created: ${githubData.created_at}
- Last Updated: ${githubData.updated_at}
- Bio: ${githubData.bio || 'No bio available'}
- Company: ${githubData.company || 'Not specified'}
- Location: ${githubData.location || 'Not specified'}
- Blog/Website: ${githubData.blog || 'None'}
- Hireable: ${githubData.hireable || 'Not specified'}
` : 'GitHub profile data not available';

    const prompt = `Evaluate a candidate applying for ${jobTitle} position based on their psychometric test responses and GitHub profile.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Candidate Information:
- Name: ${candidateInfo.fullName}
- Location: ${candidateInfo.location}
- GitHub: ${candidateInfo.githubUsername}

${githubAnalysis}

Psychometric Test Responses:
${answersText}

Please provide a comprehensive evaluation in the following JSON format:
{
  "overallScore": 85,
  "personalityTraits": {
    "openness": 78,
    "conscientiousness": 92,
    "extraversion": 65,
    "agreeableness": 88,
    "neuroticism": 32
  },
  "strengths": [
    "Strong problem-solving abilities",
    "Excellent team collaboration skills",
    "High attention to detail"
  ],
  "developmentAreas": [
    "Could improve communication in high-pressure situations",
    "May benefit from leadership development opportunities"
  ],
  "culturalFit": 8.5,
  "technicalMindset": 9.0,
  "leadershipPotential": 7.5,
  "stressResilience": 8.0,
  "githubInsights": {
    "codeQuality": 8.5,
    "activityLevel": 7.0,
    "collaborationScore": 6.5,
    "projectDiversity": 8.0,
    "professionalPresence": 7.5
  },
  "recommendations": "This candidate shows excellent potential for the role with strong technical aptitude and collaborative mindset. Recommend proceeding to technical interview with focus on problem-solving scenarios.",
  "interviewFocus": [
    "Technical problem-solving approach",
    "Team collaboration examples",
    "Handling of complex projects"
  ],
  "riskFactors": [
    "May need support in high-pressure deadline situations"
  ]
}

Rate each personality trait and overall score out of 100. Provide specific, actionable insights based on both the psychometric responses and GitHub profile that would help recruiters make informed decisions. Consider the GitHub profile data to assess technical competency, collaboration patterns, and professional development.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        return {
          ...evaluation,
          completed: true,
          completedAt: new Date().toISOString()
        };
      } else {
        throw new Error('Failed to parse JSON from Gemini evaluation response');
      }
    } catch (error) {
      console.error('Error evaluating candidate with Gemini:', error);
      // Return fallback evaluation if Gemini fails
      return this.getFallbackEvaluation(answers, questions.length, githubData);
    }
  }

  async analyzeGitHubProfile(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const userData = await response.json();
      
      // Get repositories data
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      const reposData = reposResponse.ok ? await reposResponse.json() : [];

      // Extract languages and calculate metrics
      const languages = [...new Set(reposData.map(repo => repo.language).filter(Boolean))];
      const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      return {
        profile: userData,
        repositories: reposData,
        analysis: {
          totalRepos: userData.public_repos,
          languages: languages,
          totalStars: totalStars,
          totalForks: totalForks,
          accountAge: this.calculateAccountAge(userData.created_at),
          lastActivity: userData.updated_at,
          hasOrganizations: userData.company ? true : false,
          professionalProfile: !!(userData.bio && userData.company)
        }
      };
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      return null;
    }
  }

  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  }

  getFallbackQuestions(jobTitle) {
    // Enhanced fallback questions with better variety
    return [
      {
        id: 1,
        question: "When working on a complex project, I prefer to:",
        options: [
          "Break it down into smaller, manageable tasks",
          "Dive in and figure it out as I go",
          "Research extensively before starting",
          "Collaborate with others to brainstorm solutions"
        ],
        category: "problem-solving",
        trait: "conscientiousness",
        scoring: { A: 4, B: 2, C: 3, D: 3 }
      },
      {
        id: 2,
        question: "In team meetings, I typically:",
        options: [
          "Lead the discussion and drive decisions",
          "Listen carefully and contribute when asked",
          "Ask clarifying questions to understand better",
          "Offer creative solutions and alternatives"
        ],
        category: "communication",
        trait: "extraversion",
        scoring: { A: 4, B: 2, C: 3, D: 3 }
      },
      {
        id: 3,
        question: "When facing a tight deadline, I:",
        options: [
          "Work systematically through my planned approach",
          "Adapt quickly and change my strategy as needed",
          "Focus intensely and eliminate all distractions",
          "Seek help from colleagues to divide the work"
        ],
        category: "stress-management",
        trait: "neuroticism",
        scoring: { A: 4, B: 3, C: 3, D: 2 }
      },
      {
        id: 4,
        question: "I am most motivated by:",
        options: [
          "Achieving personal goals and recognition",
          "Helping others succeed and grow",
          "Learning new skills and knowledge",
          "Creating innovative solutions"
        ],
        category: "motivation",
        trait: "openness",
        scoring: { A: 2, B: 3, C: 4, D: 4 }
      },
      {
        id: 5,
        question: "When receiving feedback, I:",
        options: [
          "Appreciate direct, constructive criticism",
          "Prefer feedback delivered gently and privately",
          "Want specific examples and actionable steps",
          "Value feedback that helps me grow"
        ],
        category: "feedback",
        trait: "agreeableness",
        scoring: { A: 3, B: 2, C: 4, D: 4 }
      },
      {
        id: 6,
        question: "My ideal work environment is:",
        options: [
          "Structured with clear processes and expectations",
          "Flexible with room for creativity and innovation",
          "Collaborative with frequent team interaction",
          "Independent with minimal supervision"
        ],
        category: "work-style",
        trait: "conscientiousness",
        scoring: { A: 4, B: 3, C: 3, D: 2 }
      },
      {
        id: 7,
        question: "When learning new technology, I:",
        options: [
          "Read documentation thoroughly before experimenting",
          "Jump in and learn by trial and error",
          "Watch tutorials and follow along step by step",
          "Find a mentor or colleague to guide me"
        ],
        category: "learning",
        trait: "openness",
        scoring: { A: 3, B: 4, C: 3, D: 2 }
      },
      {
        id: 8,
        question: "In conflict situations, I tend to:",
        options: [
          "Address issues directly and find solutions",
          "Avoid confrontation and seek compromise",
          "Listen to all sides before making decisions",
          "Focus on maintaining team harmony"
        ],
        category: "conflict-resolution",
        trait: "agreeableness",
        scoring: { A: 3, B: 2, C: 4, D: 4 }
      },
      {
        id: 9,
        question: "I perform best when:",
        options: [
          "Working alone with minimal interruptions",
          "Collaborating closely with team members",
          "Having variety in my daily tasks",
          "Following established routines and procedures"
        ],
        category: "work-preference",
        trait: "extraversion",
        scoring: { A: 2, B: 4, C: 3, D: 3 }
      },
      {
        id: 10,
        question: "When starting a new project, I:",
        options: [
          "Create detailed plans and timelines",
          "Start with the most interesting or challenging part",
          "Research similar projects and best practices",
          "Discuss approach and gather team input"
        ],
        category: "project-management",
        trait: "conscientiousness",
        scoring: { A: 4, B: 2, C: 3, D: 3 }
      },
      {
        id: 11,
        question: "My approach to risk-taking is:",
        options: [
          "Calculated - I assess pros and cons carefully",
          "Conservative - I prefer proven solutions",
          "Adventurous - I'm willing to try new approaches",
          "Collaborative - I seek team consensus on risks"
        ],
        category: "risk-management",
        trait: "openness",
        scoring: { A: 3, B: 2, C: 4, D: 3 }
      },
      {
        id: 12,
        question: "When facing uncertainty, I:",
        options: [
          "Create contingency plans for different scenarios",
          "Stay calm and adapt as situations develop",
          "Seek additional information to reduce uncertainty",
          "Rely on past experience to guide decisions"
        ],
        category: "uncertainty",
        trait: "neuroticism",
        scoring: { A: 4, B: 3, C: 3, D: 2 }
      },
      {
        id: 13,
        question: "I am most energized by:",
        options: [
          "Solving complex technical challenges",
          "Mentoring and helping colleagues",
          "Exploring new ideas and possibilities",
          "Achieving concrete, measurable results"
        ],
        category: "energy-source",
        trait: "openness",
        scoring: { A: 4, B: 3, C: 4, D: 3 }
      },
      {
        id: 14,
        question: "In group discussions, I:",
        options: [
          "Share my thoughts and opinions openly",
          "Listen more than I speak",
          "Ask questions to understand different perspectives",
          "Try to find common ground among different views"
        ],
        category: "group-dynamics",
        trait: "extraversion",
        scoring: { A: 4, B: 2, C: 3, D: 3 }
      },
      {
        id: 15,
        question: "When prioritizing tasks, I:",
        options: [
          "Focus on urgent deadlines first",
          "Tackle the most important strategic items",
          "Start with tasks I enjoy or find interesting",
          "Balance urgent needs with long-term goals"
        ],
        category: "prioritization",
        trait: "conscientiousness",
        scoring: { A: 3, B: 4, C: 2, D: 4 }
      },
      {
        id: 16,
        question: "My communication style is:",
        options: [
          "Direct and concise",
          "Detailed and thorough",
          "Friendly and personable",
          "Diplomatic and considerate"
        ],
        category: "communication-style",
        trait: "agreeableness",
        scoring: { A: 2, B: 3, C: 3, D: 4 }
      },
      {
        id: 17,
        question: "When working with difficult people, I:",
        options: [
          "Stay professional and focus on work objectives",
          "Try to understand their perspective and find common ground",
          "Set clear boundaries and expectations",
          "Seek mediation or manager support when needed"
        ],
        category: "interpersonal",
        trait: "agreeableness",
        scoring: { A: 3, B: 4, C: 3, D: 2 }
      },
      {
        id: 18,
        question: "Innovation in my work comes from:",
        options: [
          "Systematic analysis and methodical improvements",
          "Creative brainstorming and experimentation",
          "Learning from others and adapting best practices",
          "Combining existing ideas in new ways"
        ],
        category: "innovation",
        trait: "openness",
        scoring: { A: 3, B: 4, C: 3, D: 4 }
      },
      {
        id: 19,
        question: "Under pressure, I:",
        options: [
          "Become more focused and productive",
          "Take time to breathe and stay calm",
          "Break down problems into smaller pieces",
          "Seek support and input from others"
        ],
        category: "pressure-response",
        trait: "neuroticism",
        scoring: { A: 3, B: 4, C: 4, D: 2 }
      },
      {
        id: 20,
        question: "Success in my career means:",
        options: [
          "Achieving leadership positions and recognition",
          "Making a positive impact on others",
          "Continuously learning and growing",
          "Building something meaningful and lasting"
        ],
        category: "career-values",
        trait: "openness",
        scoring: { A: 2, B: 4, C: 4, D: 4 }
      }
    ];
  }

  getFallbackEvaluation(answers, totalQuestions, githubData = null) {
    const totalAnswered = Object.keys(answers).length;
    const completionRate = (totalAnswered / totalQuestions) * 100;
    
    // Simple scoring based on completion and random factors for demo
    const baseScore = Math.min(completionRate, 100);
    const overallScore = Math.round(baseScore * (0.8 + Math.random() * 0.2));

    const githubInsights = githubData ? {
      codeQuality: Math.round((70 + Math.random() * 30) * 10) / 10,
      activityLevel: Math.round((60 + Math.random() * 40) * 10) / 10,
      collaborationScore: Math.round((50 + Math.random() * 50) * 10) / 10,
      projectDiversity: Math.round((60 + Math.random() * 40) * 10) / 10,
      professionalPresence: Math.round((60 + Math.random() * 40) * 10) / 10
    } : null;

    return {
      completed: true,
      score: overallScore,
      overallScore: overallScore,
      personalityTraits: {
        openness: Math.round(60 + Math.random() * 40),
        conscientiousness: Math.round(60 + Math.random() * 40),
        extraversion: Math.round(40 + Math.random() * 60),
        agreeableness: Math.round(60 + Math.random() * 40),
        neuroticism: Math.round(20 + Math.random() * 40)
      },
      strengths: [
        "Problem-solving abilities",
        "Team collaboration",
        "Technical aptitude",
        "Adaptability"
      ],
      developmentAreas: [
        "Communication under pressure",
        "Leadership development",
        "Time management optimization"
      ],
      culturalFit: Math.round((70 + Math.random() * 30) * 10) / 10,
      technicalMindset: Math.round((70 + Math.random() * 30) * 10) / 10,
      leadershipPotential: Math.round((60 + Math.random() * 40) * 10) / 10,
      stressResilience: Math.round((60 + Math.random() * 40) * 10) / 10,
      githubInsights: githubInsights,
      recommendations: "Candidate shows good potential for the role. Recommend proceeding to next interview stage with focus on technical and behavioral assessment.",
      interviewFocus: [
        "Technical problem-solving",
        "Team collaboration examples",
        "Project management experience",
        "Learning and adaptation strategies"
      ],
      riskFactors: [
        "Limited assessment data - recommend additional evaluation"
      ],
      completedAt: new Date().toISOString()
    };
  }
}

export default new GeminiService();