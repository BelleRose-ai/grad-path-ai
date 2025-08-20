
import React from 'react';

interface AlertMessageProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  const baseClasses = "p-4 my-4 rounded-md shadow-md flex items-center justify-between";
  let typeClasses = "";

  switch (type) {
    case 'error':
      typeClasses = "bg-red-100 border border-red-400 text-red-700";
      break;
    case 'success':
      typeClasses = "bg-green-100 border border-green-400 text-green-700";
      break;
    case 'info':
      typeClasses = "bg-blue-100 border border-blue-400 text-blue-700";
      break;
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-current focus:outline-none"
          aria-label="Close alert"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
    