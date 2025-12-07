import React from 'react';
import { Globe } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Global<span className="text-indigo-600">Pulse</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;