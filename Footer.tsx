import React from 'react';
import { LinkedInIcon } from './LinkedInIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 text-center mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} GradPath AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm mb-2 sm:mb-0">
            <span>Made with love by Michelle Emmanuel</span>
            <a
              href="https://www.linkedin.com/in/michelle-emmanuel/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Michelle Emmanuel's LinkedIn Profile"
              className="text-sky-400 hover:text-sky-300 transition-colors duration-150"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
        <p className="text-xs mt-4 text-slate-400">
          Disclaimer: This tool uses AI and provides suggestions based on input data. It is not a guarantee of admission or scholarship. Always consult official university resources.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
