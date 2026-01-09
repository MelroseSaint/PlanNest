import React from 'react';

interface AiDisclaimerBannerProps {
  className?: string;
}

export const AiDisclaimerBanner: React.FC<AiDisclaimerBannerProps> = ({ className = '' }) => {
  return (
    <div className={`bg-blue-50 border-l-4 border-blue-500 p-4 print:hidden shadow-sm ${className}`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3" role="img" aria-label="AI">✨</span>
        <div>
          <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">AI Features Active</h4>
          <p className="text-sm text-blue-800 mt-1">
            Artificial Intelligence features are available in this editor to assist with planning. 
            All AI-generated content is for suggestion purposes only and must be reviewed for accuracy, safety, and compliance with applicable regulations.
          </p>
        </div>
      </div>
    </div>
  );
};
