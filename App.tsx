import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import NewsCard from './components/NewsCard';
import LoadingState from './components/LoadingState';
import { NewsData, LoadingState as LoadState } from './types';
import { fetchNewsAndImage } from './services/gemini';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadState>(LoadState.IDLE);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (country: string) => {
    setLoadingState(LoadState.SEARCHING);
    setError(null);
    setNewsData(null);

    try {
      // We can set an intermediate state if we broke the service into two calls, 
      // but currently it handles both. We'll treat it as a sequence for UX.
      
      // Start logic
      const data = await fetchNewsAndImage(country);
      
      // Simulate a brief transition to "Generating Image" visually if it happened too fast,
      // but realistically fetchNewsAndImage does both await calls. 
      // If we want to update the UI between text and image, we would need to split the service function.
      // For simplicity in this single-file service structure, we'll just show the searching state 
      // or assume the service takes enough time that a single spinner is fine, 
      // BUT to satisfy the prompt's "Creative Image" emphasis, let's show the user we are working on it.
      // Since the service awaits both, we can't update state *in the middle* of the await unless we refactor.
      // Let's keep it simple: The service awaits both.
      
      setNewsData(data);
      setLoadingState(LoadState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch news. Please try again.");
      setLoadingState(LoadState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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