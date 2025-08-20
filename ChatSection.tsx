import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { UserIcon } from './UserIcon';
import { SparklesIcon } from './SparklesIcon'; // For AI/Bot icon
import { PaperAirplaneIcon } from './PaperAirplaneIcon'; // Send button icon

interface ChatSectionProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  profileName: string; // To address the user
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatHistory, onSendMessage, isLoading, error, profileName }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;
    await onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="mt-10 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
        Continue the Conversation with GradPath AI
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Have more questions about your evaluation, {profileName}? Ask away!
      </p>

      <div className="bg-slate-50 rounded-lg shadow-inner p-4 h-96 overflow-y-auto mb-4 border border-slate-200 flex flex-col space-y-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-xl shadow ${
              msg.role === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 
              msg.role === 'model' ? 'bg-indigo-100 text-indigo-800 rounded-bl-none' :
              'bg-red-100 text-red-700 border border-red-300' // System/error message
            }`}>
              <div className="flex items-center mb-1">
                {msg.role === 'user' && <UserIcon className="w-5 h-5 mr-2" />}
                {msg.role === 'model' && <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />}
                <span className="font-semibold text-sm">
                  {msg.role === 'user' ? (profileName || 'You') : msg.role === 'model' ? 'GradPath AI' : 'System'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs mt-1 opacity-75 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && chatHistory.some(m => m.role === 'user') && ( // Show loading only if user has sent a message
            <div className="flex justify-start">
                 <div className="max-w-xs p-3 rounded-lg bg-indigo-100 text-indigo-800 shadow rounded-bl-none">
                    <div className="flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
                        <span className="text-sm italic">GradPath AI is typing...</span>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>

      {error && <p className="text-red-500 text-sm mb-2">Chat Error: {error}</p>}

      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-grow mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          disabled={isLoading}
          aria-label="Your message"
        />
        <button
          type="submit"
          disabled={isLoading || newMessage.trim() === ''}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
