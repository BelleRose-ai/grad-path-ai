
import React from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AcademicCapIcon className="h-10 w-10 text-sky-300" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            GradPath AI
          </h1>
        </div>
        {/* <nav>
          <a href="#about" className="text-sky-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;