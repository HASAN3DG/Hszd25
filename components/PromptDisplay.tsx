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
    <div className="w-full glass-card rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-cyan-300 mb-3">{title}</h3>
      <div className="relative w-full min-h-[120px] bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-slate-300 flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : prompt ? (
          <p className="whitespace-pre-wrap w-full">{prompt}</p>
        ) : (
          <p className="text-slate-500 text-center px-4">{placeholder}</p>
        )}
        {prompt && !isLoading && (
          <button
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-colors text-slate-400 hover:text-cyan-300"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptDisplay;