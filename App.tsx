import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import NewsCard from './components/NewsCard';
import LoadingState from './components/LoadingState';
import { NewsData, LoadingState as LoadState } from './types';
import { fetchNewsAndImage } from './services/gemini';
import { AlertCircle } from 'lucide-react';

const BACKGROUND_COLORS = [
  'bg-slate-50',
  'bg-red-50',
  'bg-orange-50',
  'bg-amber-50',
  'bg-yellow-50',
  'bg-lime-50',
  'bg-green-50',
  'bg-emerald-50',
  'bg-teal-50',
  'bg-cyan-50',
  'bg-sky-50',
  'bg-blue-50',
  'bg-indigo-50',
  'bg-violet-50',
  'bg-purple-50',
  'bg-fuchsia-50',
  'bg-pink-50',
  'bg-rose-50'
];

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadState>(LoadState.IDLE);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('bg-slate-50');

  const changeBackgroundColor = () => {
    // Filter out the current color to ensure it changes
    const availableColors = BACKGROUND_COLORS.filter(c => c !== bgColor);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setBgColor(randomColor);
  };

  const handleSearch = async (country: string) => {
    // Change background immediately for visual feedback
    changeBackgroundColor();
    
    setLoadingState(LoadState.SEARCHING);
    setError(null);
    setNewsData(null);

    try {
      const data = await fetchNewsAndImage(country);
      setNewsData(data);
      setLoadingState(LoadState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch news. Please try again.");
      setLoadingState(LoadState.ERROR);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ease-in-out ${bgColor}`}>
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        
        <div className={`w-full transition-all duration-500 ${newsData || loadingState !== LoadState.IDLE ? 'py-0' : 'py-20'}`}>
           <div className="flex flex-col items-center text-center mb-10">
             {!newsData && loadingState === LoadState.IDLE && (
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                 What's happening in...
               </h2>
             )}
             <SearchForm 
                onSearch={handleSearch} 
                isLoading={loadingState === LoadState.SEARCHING || loadingState === LoadState.GENERATING_IMAGE} 
             />
           </div>
        </div>

        {error && (
          <div className="w-full max-w-lg bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-fade-in mb-8">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <LoadingState state={loadingState} />

        {loadingState === LoadState.COMPLETE && newsData && (
          <NewsCard data={newsData} />
        )}

      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Global Pulse. Powered by Google Gemini & Imagen.</p>
      </footer>
    </div>
  );
};

export default App;