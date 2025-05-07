import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullScreen = false, text = 'Loading...' }) => {
  // Determine spinner size
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.medium;

  // Full screen spinner
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div className={`${spinnerClass} border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4`}></div>
          {text && <p className="text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }

  // Inline spinner
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerClass} border-t-blue-500 border-blue-200 rounded-full animate-spin`}></div>
      {text && <p className="text-gray-700 mt-2">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
