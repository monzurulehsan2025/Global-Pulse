import React from 'react';
import { LoadingState as State } from '../types';

interface LoadingStateProps {
  state: State;
}

const LoadingState: React.FC<LoadingStateProps> = ({ state }) => {
  if (state === State.IDLE || state === State.COMPLETE || state === State.ERROR) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 animate-pulse"></div>
        {/* Inner spinner */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">
          {state === State.SEARCHING ? "Scanning Global Headlines..." : "Designing Editorial Artwork..."}
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          {state === State.SEARCHING 
            ? "Searching reliable sources for the most impactful story of the last 24 hours." 
            : "Using Imagen to generate a unique visual representation of the event."}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;