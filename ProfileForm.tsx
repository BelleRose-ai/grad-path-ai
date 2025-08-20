
import React from 'react';
import { UserProfile } from '../types';
import { LightBulbIcon } from './icons/LightBulbIcon'; // Placeholder, replace with actual icon path

interface ProfileFormProps {
  profileData: UserProfile;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClearForm: () => void;
}

interface FormFieldProps {
  id: keyof UserProfile;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  isTextArea?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  info?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, type = "text", placeholder, value, onChange, required, isTextArea, options, rows, info }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        name={id}
        rows={rows || 4}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    ) : options ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    )}
    {info && <p className="mt-1 text-xs text-slate-500 flex items-center"><LightBulbIcon className="w-4 h-4 mr-1 text-yellow-500" /> {info}</p>}
  </div>
);


const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, onProfileChange, onSubmit, isLoading, onClearForm }) => {
  const cgpaScales = [
    { value: "4.0", label: "4.0 Scale" },
    { value: "4.33", label: "4.33 Scale" },
    { value: "5.0", label: "5.0 Scale" },
    { value: "10.0", label: "10.0 Scale (e.g., India)" },
    { value: "100", label: "Percentage (e.g. 0-100%)" },
  ];
  
  return (
    <form onSubmit={onSubmit} className="space-y-8 divide-y divide-slate-200">
      <div>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-1">Your Academic Profile</h2>
        <p className="text-sm text-slate-600 mb-6">Tell us about your achievements and aspirations.</p>
        
        <FormField id="fullName" label="Full Name (Optional)" placeholder="e.g., Jane Doe" value={profileData.fullName} onChange={onProfileChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="cgpa" label="CGPA / Grade" type="number" placeholder="e.g., 3.8" value={profileData.cgpa} onChange={onProfileChange} required info="Your Cumulative Grade Point Average or equivalent." />
          <FormField id="cgpaScale" label="CGPA Scale" value={profileData.cgpaScale} onChange={onProfileChange} options={cgpaScales} required />
        </div>

        <FormField id="major" label="Intended Major/Field of Study" placeholder="e.g., Computer Science, Electrical Engineering" value={profileData.major} onChange={onProfileChange} required />
        <FormField id="academicAchievements" label="Academic Achievements" placeholder="e.g., Dean's List, publications, key projects. List 2-3 major ones." value={profileData.academicAchievements} onChange={onProfileChange} isTextArea info="Describe significant academic accomplishments like research papers, capstone projects, or thesis work."/>
        <FormField id="awardsAndHonors" label="Awards and Honors" placeholder="e.g., 'Best Project Award', 'National Merit Scholar'" value={profileData.awardsAndHonors} onChange={onProfileChange} isTextArea />
        <FormField id="testScores" label="Standardized Test Scores" placeholder="e.g., GRE: 325 (Q:165, V:160), TOEFL: 108, IELTS: 7.5" value={profileData.testScores} onChange={onProfileChange} isTextArea info="Include scores for relevant tests like GRE, GMAT, TOEFL, IELTS etc."/>
        <FormField id="extracurricularActivities" label="Extracurricular Activities & Leadership" placeholder="e.g., 'President of Coding Club', 'Volunteer at Local Shelter', 'Varsity Sports'" value={profileData.extracurricularActivities} onChange={onProfileChange} isTextArea info="Highlight leadership roles, significant contributions, or unique experiences."/>
      </div>

      <div className="pt-8">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-1">Target University</h2>
        <p className="text-sm text-slate-600 mb-6">Specify the university and program you're aiming for.</p>
        <FormField id="targetUniversity" label="Target University Name" placeholder="e.g., Stanford University, MIT" value={profileData.targetUniversity} onChange={onProfileChange} required />
        <FormField id="targetProgram" label="Target Program at University" placeholder="e.g., MS in Computer Science, PhD in Physics" value={profileData.targetProgram} onChange={onProfileChange} required />
      </div>

      <div className="pt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={onClearForm}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition duration-150 ease-in-out disabled:opacity-50"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Evaluating...
            </>
          ) : (
            'Evaluate My Profile'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;