export interface UserProfile {
  fullName: string; // Not sent to Gemini, for form purposes
  cgpa: string;
  cgpaScale: string; // e.g., "4.0", "5.0", "10.0"
  major: string;
  academicAchievements: string; // User describes, e.g., "Published 2 papers, led senior project on..."
  awardsAndHonors: string; // User describes
  testScores: string; // User describes, e.g., "GRE: 320 (Q:165, V:155), TOEFL: 105"
  extracurricularActivities: string;
  targetUniversity: string;
  targetProgram: string;
}

export interface ImprovementArea {
  area: string;
  suggestion: string;
}

export interface AlternativeUniversity {
  name: string;
  program: string;
  reasoning: string;
}

export interface EvaluationResult {
  matchStrength: string;
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: ImprovementArea[];
  alternativeUniversities: AlternativeUniversity[];
  scholarshipOutlook: string;
}

export interface ChatMessage {
  id: string; // Unique ID for each message for React keys
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

// For Gemini API related types, if needed elsewhere, define here.
// For now, they are mostly handled within geminiService.ts