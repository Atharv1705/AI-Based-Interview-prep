/* eslint-disable */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.port;
const GEMINI_API_KEY = config.geminiApiKey;
const VAPI_API_KEY = config.vapiApiKey;

app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:8080', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In-memory storage (replaces MongoDB) - Updated to match frontend expectations
const sessions = new Map(); // sessionId -> { id, email }
const users = new Map(); // userId -> { userId, email, passwordHash, full_name, created_at, updated_at }
const profiles = new Map(); // userId -> { id, user_id, email, full_name, avatar_url, company, role, experience_level, bio, skill_level, preferred_industries, notification_preferences, interview_count, total_practice_time, created_at, updated_at }
const interviews = new Map(); // interviewId -> { id, user_id, title, company, job_role, industry, difficulty, type, duration, score, feedback, transcript, status, overall_score, created_at, updated_at, completed_at }
const questions = new Map(); // questionId -> { id, interview_id, category, industry, difficulty, question_text, expected_keywords, sample_answer, user_response, ai_feedback, score, expected_answer, created_at, updated_at }
const analytics = new Map(); // userId -> { user_id, total_interviews, average_score, best_score, last_interview_date, total_practice_time }

// Helpers
function setSessionCookie(res, sessionId) {
  res.cookie(config.cookie.name, sessionId, {
    httpOnly: true,
    sameSite: config.cookie.sameSite,
    secure: config.cookie.secure,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  });
}

function authMiddleware(req, res, next) {
  const sid = req.cookies[config.cookie.name];
  if (!sid) return res.status(401).json({ error: 'Not authenticated' });
  const user = sessions.get(sid);
  if (!user) return res.status(401).json({ error: 'Invalid session' });
  req.user = user;
  next();
}

// Auth
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  // Check if user exists
  const existing = Array.from(users.values()).find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'User already exists' });
  
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();
  
  // Create user
  users.set(id, { 
    userId: id, 
    email, 
    passwordHash, 
    full_name: fullName || null,
    created_at: now,
    updated_at: now
  });
  
  // Create profile with all required fields
  profiles.set(id, { 
    id: id,
    user_id: id, 
    email, 
    full_name: fullName || null, 
    avatar_url: null,
    company: null,
    role: null,
    experience_level: 'beginner',
    bio: null,
    skill_level: 'beginner',
    preferred_industries: [],
    notification_preferences: {},
    interview_count: 0,
    total_practice_time: 0,
    created_at: now,
    updated_at: now
  });
  
  // Create analytics
  analytics.set(id, { 
    user_id: id,
    total_interviews: 0,
    average_score: 0,
    best_score: 0,
    last_interview_date: null,
    total_practice_time: 0
  });
  
  const sid = uuidv4();
  sessions.set(sid, { id, email });
  setSessionCookie(res, sid);
  return res.json({ user: { id, email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  
  // Find user
  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  
  const sid = uuidv4();
  sessions.set(sid, { id: user.userId, email: user.email });
  setSessionCookie(res, sid);
  return res.json({ user: { id: user.userId, email: user.email } });
});

app.post('/api/auth/logout', (req, res) => {
  const sid = req.cookies[config.cookie.name];
  if (sid) sessions.delete(sid);
  res.clearCookie(config.cookie.name, { path: '/' });
  res.status(204).end();
});

app.get('/api/auth/me', (req, res) => {
  const sid = req.cookies[config.cookie.name];
  if (!sid) return res.json({ user: null });
  const user = sessions.get(sid);
  return res.json({ user: user || null });
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  
  const user = users.get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid current password' });
  
  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  user.updated_at = new Date();
  users.set(req.user.id, user);
  
  res.status(204).end();
});

app.delete('/api/auth/delete-account', authMiddleware, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });
  
  const user = users.get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid password' });
  
  // Delete all user data
  users.delete(req.user.id);
  profiles.delete(req.user.id);
  analytics.delete(req.user.id);
  
  // Delete sessions
  for (const [sid, session] of sessions.entries()) {
    if (session.id === req.user.id) {
      sessions.delete(sid);
    }
  }
  
  // Delete interviews and questions
  for (const [interviewId, interview] of interviews.entries()) {
    if (interview.user_id === req.user.id) {
      interviews.delete(interviewId);
      // Delete related questions
      for (const [questionId, question] of questions.entries()) {
        if (question.interview_id === interviewId) {
          questions.delete(questionId);
        }
      }
    }
  }
  
  res.clearCookie(config.cookie.name, { path: '/' });
  res.status(204).end();
});

// Profile routes - Updated to match frontend expectations
app.get('/api/profile/:id', authMiddleware, (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
  // Return profile in the format expected by frontend
  const frontendProfile = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    company: profile.company,
    role: profile.role,
    experience_level: profile.experience_level,
    bio: profile.bio,
    skill_level: profile.skill_level,
    preferred_industries: profile.preferred_industries,
    notification_preferences: profile.notification_preferences,
    interview_count: profile.interview_count,
    total_practice_time: profile.total_practice_time,
    created_at: profile.created_at,
    updated_at: profile.updated_at
  };
  
  res.json(frontendProfile);
});

app.put('/api/profile/:id', authMiddleware, async (req, res) => {
  const profile = profiles.get(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
  const updates = req.body || {};
  
  // Map frontend field names to backend field names
  const mappedUpdates = {
    ...updates,
    // Handle field name mappings
    ...(updates.full_name !== undefined && { full_name: updates.full_name }),
    ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
    ...(updates.company !== undefined && { company: updates.company }),
    ...(updates.role !== undefined && { role: updates.role }),
    ...(updates.bio !== undefined && { bio: updates.bio }),
    ...(updates.skill_level !== undefined && { skill_level: updates.skill_level }),
    ...(updates.preferred_industries !== undefined && { preferred_industries: updates.preferred_industries }),
    ...(updates.notification_preferences !== undefined && { notification_preferences: updates.notification_preferences }),
    updated_at: new Date()
  };
  
  const updated = { ...profile, ...mappedUpdates };
  profiles.set(req.params.id, updated);
  
  // Return in frontend format
  const frontendProfile = {
    id: updated.id,
    email: updated.email,
    full_name: updated.full_name,
    avatar_url: updated.avatar_url,
    company: updated.company,
    role: updated.role,
    experience_level: updated.experience_level,
    bio: updated.bio,
    skill_level: updated.skill_level,
    preferred_industries: updated.preferred_industries,
    notification_preferences: updated.notification_preferences,
    interview_count: updated.interview_count,
    total_practice_time: updated.total_practice_time,
    created_at: updated.created_at,
    updated_at: updated.updated_at
  };
  
  res.json(frontendProfile);
});

// Photo upload endpoint
app.post('/api/profile/:id/photo', authMiddleware, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 2MB.' });
      }
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: 'Invalid file type. Only image files are allowed.' });
    }
    
    // Continue with the upload logic
    handlePhotoUpload(req, res);
  });
});

async function handlePhotoUpload(req, res) {
  try {
    const profile = profiles.get(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Generate the URL for the uploaded file
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Update profile with new avatar URL
    const updated = { ...profile, avatar_url: avatarUrl, updated_at: new Date() };
    profiles.set(req.params.id, updated);
    
    // Return in frontend format
    const frontendProfile = {
      id: updated.id,
      email: updated.email,
      full_name: updated.full_name,
      avatar_url: updated.avatar_url,
      company: updated.company,
      role: updated.role,
      experience_level: updated.experience_level,
      bio: updated.bio,
      skill_level: updated.skill_level,
      preferred_industries: updated.preferred_industries,
      notification_preferences: updated.notification_preferences,
      interview_count: updated.interview_count,
      total_practice_time: updated.total_practice_time,
      created_at: updated.created_at,
      updated_at: updated.updated_at
    };
    
    res.json({ 
      success: true, 
      avatar_url: avatarUrl,
      profile: frontendProfile 
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
}

// Privacy settings - Updated to match frontend expectations
app.get('/api/privacy', authMiddleware, (req, res) => {
  const profile = profiles.get(req.user.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
  res.json({
    share_data: profile.notification_preferences?.share_data || true,
    data_retention_months: profile.notification_preferences?.data_retention_months || 12,
  });
});

app.put('/api/privacy', authMiddleware, async (req, res) => {
  const profile = profiles.get(req.user.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
  const updates = req.body || {};
  const updated = { 
    ...profile, 
    notification_preferences: { ...profile.notification_preferences, ...updates },
    updated_at: new Date() 
  };
  profiles.set(req.user.id, updated);
  
  res.json(updated.notification_preferences);
});

// Data export - Updated to match frontend expectations
app.get('/api/account/export', authMiddleware, (req, res) => {
  const user = users.get(req.user.id);
  const profile = profiles.get(req.user.id);
  const userInterviews = Array.from(interviews.values()).filter(i => i.user_id === req.user.id);
  const userQuestions = Array.from(questions.values()).filter(q => 
    userInterviews.some(i => i.id === q.interview_id)
  );
  const userAnalytics = analytics.get(req.user.id);
  
  const exportData = {
    user: { ...user, passwordHash: undefined },
    profile,
    interviews: userInterviews,
    questions: userQuestions,
    analytics: userAnalytics,
    exported_at: new Date().toISOString()
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="my_data.json"');
  res.json(exportData);
});

// Interviews - Updated to match frontend expectations
app.get('/api/interviews', authMiddleware, (req, res) => {
  const userInterviews = Array.from(interviews.values()).filter(i => i.user_id === req.user.id);
  
  // Convert to frontend format
  const frontendInterviews = userInterviews.map(interview => ({
    id: interview.id,
    user_id: interview.user_id,
    title: interview.title,
    type: interview.type || 'general',
    industry: interview.industry || '',
    difficulty: interview.difficulty || 'medium',
    duration: interview.duration || 0,
    score: interview.score || null,
    feedback: interview.feedback || null,
    transcript: interview.transcript || null,
    status: interview.status || 'pending',
    company: interview.company || '',
    job_role: interview.job_role || '',
    overall_score: interview.overall_score || null,
    created_at: interview.created_at,
    updated_at: interview.updated_at,
    completed_at: interview.completed_at
  }));
  
  res.json(frontendInterviews);
});

app.post('/api/interviews', authMiddleware, async (req, res) => {
  const { title, company, job_role, industry, difficulty, type, duration } = req.body || {};
  const id = uuidv4();
  const now = new Date();
  
  const interview = {
    id,
    user_id: req.user.id,
    title: title || 'Mock Interview',
    company: company || '',
    job_role: job_role || '',
    industry: industry || '',
    difficulty: difficulty || 'medium',
    type: type || 'general',
    duration: duration || 0,
    score: null,
    feedback: null,
    transcript: null,
    status: 'in_progress',
    overall_score: null,
    created_at: now,
    updated_at: now,
    completed_at: null
  };
  
  interviews.set(id, interview);
  
  // Update profile interview count
  const profile = profiles.get(req.user.id);
  if (profile) {
    profile.interview_count = (profile.interview_count || 0) + 1;
    profiles.set(req.user.id, profile);
  }
  
  // Return in frontend format
  const frontendInterview = {
    id: interview.id,
    user_id: interview.user_id,
    title: interview.title,
    type: interview.type,
    industry: interview.industry,
    difficulty: interview.difficulty,
    duration: interview.duration,
    score: interview.score,
    feedback: interview.feedback,
    transcript: interview.transcript,
    status: interview.status,
    company: interview.company,
    job_role: interview.job_role,
    overall_score: interview.overall_score,
    created_at: interview.created_at,
    updated_at: interview.updated_at,
    completed_at: interview.completed_at
  };
  
  res.json(frontendInterview);
});

app.put('/api/interviews/:id', authMiddleware, async (req, res) => {
  const interview = interviews.get(req.params.id);
  if (!interview || interview.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Interview not found' });
  }
  
  const updates = req.body || {};
  const updated = { ...interview, ...updates, updated_at: new Date() };
  interviews.set(req.params.id, updated);
  
  // Return in frontend format
  const frontendInterview = {
    id: updated.id,
    user_id: updated.user_id,
    title: updated.title,
    type: updated.type,
    industry: updated.industry,
    difficulty: updated.difficulty,
    duration: updated.duration,
    score: updated.score,
    feedback: updated.feedback,
    transcript: updated.transcript,
    status: updated.status,
    company: updated.company,
    job_role: updated.job_role,
    overall_score: updated.overall_score,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
    completed_at: updated.completed_at
  };
  
  res.json(frontendInterview);
});

// Questions - Updated to match frontend expectations
app.get('/api/interviews/:id/questions', authMiddleware, (req, res) => {
  const interview = interviews.get(req.params.id);
  if (!interview || interview.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Interview not found' });
  }
  
  const interviewQuestions = Array.from(questions.values()).filter(q => q.interview_id === req.params.id);
  
  // Convert to frontend format
  const frontendQuestions = interviewQuestions.map(question => ({
    id: question.id,
    interview_id: question.interview_id,
    category: question.category || 'general',
    industry: question.industry || '',
    difficulty: question.difficulty || 'medium',
    question_text: question.question_text,
    expected_keywords: question.expected_keywords || [],
    sample_answer: question.sample_answer,
    user_response: question.user_response || '',
    ai_feedback: question.ai_feedback || '',
    score: question.score || null,
    expected_answer: question.expected_answer || '',
    created_at: question.created_at,
    updated_at: question.updated_at
  }));
  
  res.json(frontendQuestions);
});

app.post('/api/interviews/:id/questions', authMiddleware, async (req, res) => {
  const interview = interviews.get(req.params.id);
  if (!interview || interview.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Interview not found' });
  }
  
  const { question_text, category, industry, difficulty, expected_keywords, sample_answer, expected_answer } = req.body || {};
  const id = uuidv4();
  const now = new Date();
  
  const question = {
    id,
    interview_id: req.params.id,
    category: category || 'general',
    industry: industry || '',
    difficulty: difficulty || 'medium',
    question_text: question_text || '',
    expected_keywords: expected_keywords || [],
    sample_answer: sample_answer || null,
    user_response: '',
    ai_feedback: '',
    score: null,
    expected_answer: expected_answer || '',
    created_at: now,
    updated_at: now
  };
  
  questions.set(id, question);
  
  // Return in frontend format
  const frontendQuestion = {
    id: question.id,
    interview_id: question.interview_id,
    category: question.category,
    industry: question.industry,
    difficulty: question.difficulty,
    question_text: question.question_text,
    expected_keywords: question.expected_keywords,
    sample_answer: question.sample_answer,
    user_response: question.user_response,
    ai_feedback: question.ai_feedback,
    score: question.score,
    expected_answer: question.expected_answer,
    created_at: question.created_at,
    updated_at: question.updated_at
  };
  
  res.json(frontendQuestion);
});

app.put('/api/questions/:id', authMiddleware, async (req, res) => {
  const question = questions.get(req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  
  // Verify user owns the interview
  const interview = interviews.get(question.interview_id);
  if (!interview || interview.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  const updates = req.body || {};
  const updated = { ...question, ...updates, updated_at: new Date() };
  questions.set(req.params.id, updated);
  
  // Update analytics if score is provided
  if (updates.score !== undefined && updates.score !== null) {
    const userAnalytics = analytics.get(req.user.id);
    if (userAnalytics) {
      const allScores = Array.from(questions.values())
        .filter(q => {
          const qInterview = interviews.get(q.interview_id);
          return qInterview && qInterview.user_id === req.user.id && q.score !== null;
        })
        .map(q => q.score);
      
      const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
      const bestScore = Math.max(...allScores, 0);
      
      userAnalytics.average_score = avgScore;
      userAnalytics.best_score = bestScore;
      userAnalytics.last_interview_date = new Date();
      analytics.set(req.user.id, userAnalytics);
    }
  }
  
  // Return in frontend format
  const frontendQuestion = {
    id: updated.id,
    interview_id: updated.interview_id,
    category: updated.category,
    industry: updated.industry,
    difficulty: updated.difficulty,
    question_text: updated.question_text,
    expected_keywords: updated.expected_keywords,
    sample_answer: updated.sample_answer,
    user_response: updated.user_response,
    ai_feedback: updated.ai_feedback,
    score: updated.score,
    expected_answer: updated.expected_answer,
    created_at: updated.created_at,
    updated_at: updated.updated_at
  };
  
  res.json(frontendQuestion);
});

// Analytics
app.get('/api/analytics', authMiddleware, (req, res) => {
  const data = analytics.get(req.user.id);
  res.json(data || null);
});

// AI endpoints - Enhanced with Supabase function features
app.post('/api/ai/feedback', async (req, res) => {
  const { question, response, interviewId } = req.body || {};
  if (!question || !response) return res.status(400).json({ error: 'Question and response required' });
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are an expert interview coach. Analyze this interview response and provide constructive feedback.
    
Question: ${question}
Response: ${response}

Please provide:
1. A score from 1-10 (where 10 is excellent)
2. Specific feedback on what was good and what could be improved
3. 2-3 actionable suggestions for improvement
4. Keyword analysis of what was mentioned and what was missing

Format your response as JSON:
{
  "feedback": "detailed feedback here",
  "score": number,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "keyword_analysis": {
    "keywords_used": ["keyword1", "keyword2"],
    "keywords_missing": ["missing1", "missing2"]
  }
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Try to parse JSON from the response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsed = {
        feedback: text,
        score: 7,
        suggestions: ['Practice more', 'Be more specific', 'Use examples'],
        strengths: ['Response provided'],
        improvements: ['Could be more detailed'],
        keyword_analysis: {
          keywords_used: [],
          keywords_missing: []
        }
      };
    }

    // If interviewId is provided, update the interview with feedback
    if (interviewId) {
      const interview = interviews.get(interviewId);
      if (interview) {
        interview.feedback = parsed.feedback;
        interview.score = parsed.score;
        interview.updated_at = new Date();
        interviews.set(interviewId, interview);
      }
    }

    res.json(parsed);
  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to generate feedback',
      feedback: "I couldn't analyze your response at this time. Please try again.",
      score: 5,
      suggestions: [
        "Try to be more specific in your answer",
        "Provide concrete examples",
        "Structure your response clearly"
      ]
    });
  }
});

app.post('/api/ai/questions', async (req, res) => {
  const { jobRole, industry, difficulty, count = 5, interviewId } = req.body || {};
  if (!jobRole) return res.status(400).json({ error: 'Job role required' });
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Generate ${count} interview questions for a ${difficulty || 'medium'} level ${jobRole} position${industry ? ` in the ${industry} industry` : ''}.

Please provide questions that are appropriate for the difficulty level and relevant to the role.

For each question, provide:
1. The question text
2. The category (technical, behavioral, situational, general)
3. Expected keywords that should be mentioned
4. A sample answer or key points to cover

Format your response as JSON:
[
  {
    "question": "question text here",
    "category": "technical|behavioral|situational|general",
    "expected_keywords": ["keyword1", "keyword2"],
    "expected_answer": "brief description of what a good answer should include",
    "sample_answer": "example of a good answer"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsed;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found');
      }
    } catch (parseError) {
      // Fallback questions
      parsed = [
        {
          question: "Tell me about yourself and your experience in this field.",
          category: "general",
          expected_keywords: ["experience", "skills", "background"],
          expected_answer: "A concise summary of relevant experience and skills",
          sample_answer: "I have X years of experience in [field] with expertise in [specific skills]..."
        },
        {
          question: "What are your strengths and weaknesses?",
          category: "behavioral",
          expected_keywords: ["strengths", "weaknesses", "improvement"],
          expected_answer: "Honest assessment with examples and improvement plans",
          sample_answer: "My strengths include [specific examples]. For weaknesses, I'm working on [improvement plan]..."
        }
      ];
    }

    // If interviewId is provided, store the questions in the database
    if (interviewId) {
      const interview = interviews.get(interviewId);
      if (interview) {
        const now = new Date();
        parsed.forEach((q, index) => {
          const questionId = uuidv4();
          const question = {
            id: questionId,
            interview_id: interviewId,
            category: q.category || 'general',
            industry: industry || '',
            difficulty: difficulty || 'medium',
            question_text: q.question,
            expected_keywords: q.expected_keywords || [],
            sample_answer: q.sample_answer || null,
            user_response: '',
            ai_feedback: '',
            score: null,
            expected_answer: q.expected_answer || '',
            created_at: now,
            updated_at: now
          };
          questions.set(questionId, question);
        });
      }
    }

    res.json(parsed);
  } catch (error) {
    console.error('AI questions error:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      questions: [
        {
          question: "Tell me about yourself and your experience.",
          category: "general",
          expected_keywords: ["experience", "skills"],
          expected_answer: "Provide a brief overview of your background and relevant experience",
          sample_answer: "I have experience in [field] with skills in [specific areas]..."
        }
      ]
    });
  }
});

// Enhanced AI endpoints for Supabase function replacements
app.post('/api/ai/feedback-gemini', async (req, res) => {
  const { question, response } = req.body || {};
  if (!question || !response) return res.status(400).json({ error: 'Question and response required' });
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `As an AI interview coach, analyze this interview response:

Question: "${question}"
Candidate Response: "${response}"

Please provide:
1. Detailed feedback on the response quality
2. A score from 1-10 (10 being excellent)
3. 3-5 specific suggestions for improvement

Format your response as JSON:
{
  "feedback": "detailed feedback here",
  "score": number,
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsed;
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      parsed = {
        feedback: text || "I couldn't analyze your response at this time. Please try again.",
        score: 5,
        suggestions: [
          "Try to be more specific in your answer",
          "Provide concrete examples",
          "Structure your response clearly"
        ]
      };
    }

    // Ensure score is within valid range
    if (typeof parsed.score !== 'number' || parsed.score < 1 || parsed.score > 10) {
      parsed.score = 5;
    }

    // Ensure suggestions is an array
    if (!Array.isArray(parsed.suggestions)) {
      parsed.suggestions = [
        "Try to be more specific in your answer",
        "Provide concrete examples",
        "Structure your response clearly"
      ];
    }

    res.json(parsed);
  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ 
      error: error.message,
      feedback: "I encountered an error while analyzing your response. Please try again.",
      score: 5,
      suggestions: [
        "Try to be more specific in your answer",
        "Provide concrete examples", 
        "Structure your response clearly"
      ]
    });
  }
});

app.post('/api/ai/questions-gemini', async (req, res) => {
  const { jobRole, industry, difficulty, count = 5 } = req.body || {};
  if (!jobRole || !industry || !difficulty) {
    return res.status(400).json({ error: 'Job role, industry, and difficulty are required' });
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Generate ${count} interview questions for a ${jobRole} position in the ${industry} industry.
    Difficulty level: ${difficulty}
    
    For each question, provide:
    1. The question text
    2. The category (technical, behavioral, situational, etc.)
    3. A sample expected answer or key points to cover
    
    Format as JSON array:
    [
      {
        "question": "question text",
        "category": "category name",
        "expected_answer": "sample answer or key points"
      }
    ]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsed;
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      parsed = [
        {
          question: "Tell me about yourself and your experience.",
          category: "general",
          expected_answer: "Provide a brief overview of your background, relevant experience, and what you're looking for in this role."
        },
        {
          question: "What interests you about this position?",
          category: "behavioral",
          expected_answer: "Connect your skills and interests to the specific role and company."
        },
        {
          question: "Describe a time when you faced a challenge at work.",
          category: "situational",
          expected_answer: "Use the STAR method to describe the situation, your actions, and the results."
        }
      ];
    }

    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    // Validate and clean up the questions
    const validQuestions = parsed.map((q) => ({
      question: q.question || "Please describe your experience with this role.",
      category: q.category || "general",
      expected_answer: q.expected_answer || "Provide relevant examples and specifics about your experience."
    }));

    res.json(validQuestions);
  } catch (error) {
    console.error('AI questions error:', error);
    
    // Return fallback questions on error
    const fallbackQuestions = [
      {
        question: "Tell me about yourself and your experience.",
        category: "general",
        expected_answer: "Provide a brief overview of your background, relevant experience, and what you're looking for in this role."
      },
      {
        question: "What interests you about this position?",
        category: "behavioral",
        expected_answer: "Connect your skills and interests to the specific role and company."
      },
      {
        question: "Describe a time when you faced a challenge at work.",
        category: "situational",
        expected_answer: "Use the STAR method to describe the situation, your actions, and the results."
      }
    ];
    
    res.json(fallbackQuestions);
  }
});

// Vapi token endpoint
app.post('/api/vapi/token', authMiddleware, (req, res) => {
  res.json({ apiKey: VAPI_API_KEY });
});

// Vapi webhook
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-vapi-signature'];
    if (config.vapiWebhookSecret && signature !== config.vapiWebhookSecret) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    const { type, data = {}, metadata = {} } = event || {};
    const userId = metadata.userId;
    const interviewId = metadata.interviewId;

    switch (type) {
      case 'call-started': {
        if (userId && !interviewId) {
          const id = uuidv4();
          const now = new Date();
          const interview = {
            id,
            user_id: userId,
            title: metadata.jobTitle || 'Voice Interview',
            company: metadata.company || '',
            job_role: metadata.jobTitle || '',
            industry: metadata.industry || '',
            difficulty: metadata.difficulty || 'medium',
            type: 'general',
            duration: 0,
            score: null,
            feedback: null,
            transcript: null,
            status: 'in_progress',
            overall_score: null,
            created_at: now,
            updated_at: now,
            completed_at: null
          };
          interviews.set(id, interview);
          return res.json({ interviewId: id });
        }
        break;
      }
      case 'transcript': {
        // Could store transcripts if needed
        break;
      }
      case 'question-asked': {
        if (interviewId) {
          const id = uuidv4();
          const now = new Date();
          const question = {
            id,
            interview_id: interviewId,
            category: data.category || 'general',
            industry: data.industry || '',
            difficulty: data.difficulty || 'medium',
            question_text: data.question || '',
            expected_keywords: [],
            sample_answer: null,
            user_response: '',
            ai_feedback: '',
            score: null,
            expected_answer: '',
            created_at: now,
            updated_at: now
          };
          questions.set(id, question);
        }
        break;
      }
      case 'question-scored': {
        if (data.questionId) {
          const question = questions.get(data.questionId);
          if (question) {
            question.score = data.score;
            question.ai_feedback = data.feedback;
            question.user_response = data.user_response;
            questions.set(data.questionId, question);
            
            if (userId) {
              const userAnalytics = analytics.get(userId);
              if (userAnalytics) {
                const allScores = Array.from(questions.values())
                  .filter(q => {
                    const qInterview = interviews.get(q.interview_id);
                    return qInterview && qInterview.user_id === userId && q.score !== null;
                  })
                  .map(q => q.score);
                
                const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
                const bestScore = Math.max(...allScores, 0);
                
                userAnalytics.average_score = avgScore;
                userAnalytics.best_score = bestScore;
                userAnalytics.last_interview_date = new Date();
                analytics.set(userId, userAnalytics);
              }
            }
          }
        }
        break;
      }
      case 'call-ended': {
        if (interviewId) {
          const interview = interviews.get(interviewId);
          if (interview) {
            interview.completed_at = new Date();
            interview.status = 'completed';
            interviews.set(interviewId, interview);
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Vapi webhook error:', e);
  }
  res.status(200).end();
});

// OAuth endpoints (mock)
app.get('/api/auth/google', async (req, res) => {
  try {
    const mockUser = { 
      id: `google_${Date.now()}`, 
      email: 'user@gmail.com', 
      full_name: 'Google User', 
      avatar_url: 'https://via.placeholder.com/150', 
      provider: 'google' 
    };
    
    let user = Array.from(users.values()).find(u => u.email === mockUser.email);
    if (!user) {
      const id = mockUser.id;
      const now = new Date();
      const passwordHash = await bcrypt.hash('oauth_user', 10);
      
      users.set(id, { 
        userId: id, 
        email: mockUser.email, 
        passwordHash, 
        full_name: mockUser.full_name,
        created_at: now,
        updated_at: now
      });
      
      profiles.set(id, { 
        id: id,
        user_id: id, 
        email: mockUser.email, 
        full_name: mockUser.full_name, 
        avatar_url: mockUser.avatar_url,
        company: null,
        role: null,
        experience_level: 'beginner',
        bio: null,
        skill_level: 'beginner',
        preferred_industries: [],
        notification_preferences: {},
        interview_count: 0,
        total_practice_time: 0,
        created_at: now,
        updated_at: now
      });
      
      analytics.set(id, { 
        user_id: id,
        total_interviews: 0,
        average_score: 0,
        best_score: 0,
        last_interview_date: null,
        total_practice_time: 0
      });
      
      user = users.get(id);
    }
    
    const sid = uuidv4();
    sessions.set(sid, { id: user.userId, email: user.email });
    setSessionCookie(res, sid);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect('/auth?error=oauth_failed');
  }
});

app.get('/api/auth/github', async (req, res) => {
  try {
    const mockUser = { 
      id: `github_${Date.now()}`, 
      email: 'user@github.com', 
      full_name: 'GitHub User', 
      avatar_url: 'https://via.placeholder.com/150', 
      provider: 'github' 
    };
    
    let user = Array.from(users.values()).find(u => u.email === mockUser.email);
    if (!user) {
      const id = mockUser.id;
      const now = new Date();
      const passwordHash = await bcrypt.hash('oauth_user', 10);
      
      users.set(id, { 
        userId: id, 
        email: mockUser.email, 
        passwordHash, 
        full_name: mockUser.full_name,
        created_at: now,
        updated_at: now
      });
      
      profiles.set(id, { 
        id: id,
        user_id: id, 
        email: mockUser.email, 
        full_name: mockUser.full_name, 
        avatar_url: mockUser.avatar_url,
        company: null,
        role: null,
        experience_level: 'beginner',
        bio: null,
        skill_level: 'beginner',
        preferred_industries: [],
        notification_preferences: {},
        interview_count: 0,
        total_practice_time: 0,
        created_at: now,
        updated_at: now
      });
      
      analytics.set(id, { 
        user_id: id,
        total_interviews: 0,
        average_score: 0,
        best_score: 0,
        last_interview_date: null,
        total_practice_time: 0
      });
      
      user = users.get(id);
    }
    
    const sid = uuidv4();
    sessions.set(sid, { id: user.userId, email: user.email });
    setSessionCookie(res, sid);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect('/auth?error=oauth_failed');
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});