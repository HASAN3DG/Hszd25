import React, { useState, useEffect } from 'react';
import Loader from './Loader';

interface PromptDisplayProps {
  title: string;
  prompt: string;
  isLoading: boolean;
  placeholder: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ title, prompt, isLoading, placeholder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 shadow-inner">
      <h3 className="text-lg font-semibold text-blue-300 mb-2">{title}</h3>
      <div className="relative w-full min-h-[120px] bg-gray-900 rounded-md p-3 font-mono text-sm text-gray-300 flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : prompt ? (
          <p className="whitespace-pre-wrap w-full">{prompt}</p>
        ) : (
          <p className="text-gray-500">{placeholder}</p>
        )}
        {prompt && !isLoading && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptDisplay;
