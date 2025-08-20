
import React, { useState } from 'react';
import { EvaluationResult, ImprovementArea, AlternativeUniversity } from '../types';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { StarIcon } from './icons/StarIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface ResultsDisplayProps {
  result: EvaluationResult;
}

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children, initiallyOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 focus:outline-none transition-colors duration-150"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-slate-600" /> : <ChevronDownIcon className="w-6 h-6 text-slate-600" />}
      </button>
      {isOpen && (
        <div className="p-5 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
};

const getMatchStrengthColor = (strength: string): string => {
  const s = strength.toLowerCase();
  if (s.includes('excellent') || s.includes('strong')) return 'text-green-600 bg-green-100 border-green-500';
  if (s.includes('good') || s.includes('fair')) return 'text-yellow-600 bg-yellow-100 border-yellow-500';
  if (s.includes('competitive') || s.includes('reach')) return 'text-orange-600 bg-orange-100 border-orange-500';
  return 'text-red-600 bg-red-100 border-red-500';
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700 mb-8">
        Your Profile Evaluation
      </h2>

      <div className={`p-6 rounded-lg border-2 shadow-md ${getMatchStrengthColor(result.matchStrength)}`}>
        <h3 className="text-xl font-semibold mb-2">Overall Match Strength: {result.matchStrength}</h3>
        <p className="text-sm">{result.overallAssessment}</p>
      </div>

      {result.strengths && result.strengths.length > 0 && (
        <ResultCard title="Key Strengths" icon={<StarIcon className="w-6 h-6 text-yellow-500" />}>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            {result.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </ResultCard>
      )}

      {result.areasForImprovement && result.areasForImprovement.length > 0 && (
        <ResultCard title="Areas for Improvement" icon={<LightBulbIcon className="w-6 h-6 text-blue-500" />}>
          <div className="space-y-4">
            {result.areasForImprovement.map((item: ImprovementArea, index: number) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <h4 className="font-semibold text-slate-800">{item.area}</h4>
                <p className="text-sm text-slate-600">{item.suggestion}</p>
              </div>
            ))}
          </div>
        </ResultCard>
      )}
      
      {result.alternativeUniversities && result.alternativeUniversities.length > 0 && (
        <ResultCard title="Alternative University Suggestions" icon={<AcademicCapIcon className="w-6 h-6 text-indigo-500" />} initiallyOpen={false}>
          <div className="space-y-4">
            {result.alternativeUniversities.map((uni: AlternativeUniversity, index: number) => (
              <div key={index} className="p-3 bg-indigo-50 rounded-md border border-indigo-200">
                <h4 className="font-semibold text-indigo-800">{uni.name} - {uni.program}</h4>
                <p className="text-sm text-indigo-600">{uni.reasoning}</p>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      {result.scholarshipOutlook && (
         <ResultCard title="Scholarship Outlook" icon={<StarIcon className="w-6 h-6 text-amber-500" />} initiallyOpen={false}>
          <p className="text-sm text-slate-700">{result.scholarshipOutlook}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default ResultsDisplay;
    