import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, EvaluationResult, ChatMessage } from './types';
import { evaluateUserProfile, initializeChatSession, sendChatMessageToSession } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileForm from './components/ProfileForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import AlertMessage from './components/AlertMessage';
import ChatSection from './components/ChatSection'; // New Import
import type { Chat } from '@google/genai'; // Import Chat type

const initialProfileState: UserProfile = {
  fullName: '',
  cgpa: '',
  cgpaScale: '4.0',
  major: '',
  academicAchievements: '',
  awardsAndHonors: '',
  testScores: '',
  extracurricularActivities: '',
  targetUniversity: '',
  targetProgram: '',
};

const App: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfile>(initialProfileState);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEvaluationResult(null);
    // Reset chat when a new evaluation is submitted
    setChatSession(null);
    setChatHistory([]);
    setChatError(null);

    if (!profileData.cgpa || !profileData.major || !profileData.targetUniversity || !profileData.targetProgram) {
      setError("Please fill in all required fields: CGPA, Major, Target University, and Target Program.");
      setIsLoading(false);
      return;
    }
    
    const cgpaValue = parseFloat(profileData.cgpa);
    const cgpaScaleValue = parseFloat(profileData.cgpaScale);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > cgpaScaleValue) {
      setError(`CGPA must be a number between 0 and ${profileData.cgpaScale}.`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await evaluateUserProfile(profileData);
      setEvaluationResult(result);
    } catch (err) {
      console.error("Evaluation Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during evaluation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [profileData]);

  const handleClearForm = useCallback(() => {
    setProfileData(initialProfileState);
    setEvaluationResult(null);
    setError(null);
    // Reset chat state as well
    setChatSession(null);
    setChatHistory([]);
    setIsChatLoading(false);
    setChatError(null);
    window.scrollTo(0,0);
  }, []);

  const handleSendChatMessage = useCallback(async (messageText: string) => {
    if (!profileData || !evaluationResult) {
      setChatError("Cannot start chat without profile data and an initial evaluation.");
      return;
    }

    const userMessage: ChatMessage = { 
      id: `user-${Date.now()}`, 
      role: 'user', 
      text: messageText, 
      timestamp: new Date() 
    };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);
    setChatError(null);

    try {
      let currentChat = chatSession;
      if (!currentChat) {
        currentChat = initializeChatSession(profileData, evaluationResult);
        setChatSession(currentChat);
      }
      
      const response = await sendChatMessageToSession(currentChat, messageText);
      const aiMessage: ChatMessage = { 
        id: `model-${Date.now()}`, 
        role: 'model', 
        text: response.text, 
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error("Chat Error:", err);
      const errorMsg = err instanceof Error ? err.message : "An error occurred in the chat.";
      setChatError(errorMsg);
      const systemErrorMessage: ChatMessage = {
        id: `system-error-${Date.now()}`,
        role: 'system',
        text: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, systemErrorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatSession, profileData, evaluationResult]);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          <ProfileForm
            profileData={profileData}
            onProfileChange={handleProfileChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onClearForm={handleClearForm}
          />
          {isLoading && <LoadingSpinner />}
          {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
          {evaluationResult && !isLoading && (
            <>
              <ResultsDisplay result={evaluationResult} />
              <ChatSection
                chatHistory={chatHistory}
                onSendMessage={handleSendChatMessage}
                isLoading={isChatLoading}
                error={chatError}
                profileName={profileData.fullName || "User"}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;