import React from 'react';
import { NewsData } from '../types';
import { ExternalLink, Calendar, MapPin, Share2 } from 'lucide-react';

interface NewsCardProps {
  data: NewsData;
}

const NewsCard: React.FC<NewsCardProps> = ({ data }) => {
  return (
    <article className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 animate-slide-up">
      {/* Image Section */}
      <div className="relative w-full aspect-video group cursor-default">
        <img
          src={data.imageUrl}
          alt={data.headline}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Floating Badge */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm border border-white/50">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">{data.country}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 md:p-10">
        <div className="flex items-center space-x-4 text-slate-500 text-sm mb-6">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4" />
            <span>{data.timestamp}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="uppercase tracking-wider text-xs font-bold text-indigo-600">AI Analysis</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
          {data.headline}
        </h2>

        <div className="prose prose-lg text-slate-600 leading-relaxed mb-8">
          <p>{data.summary}</p>
        </div>

        {/* Sources & Actions Footer */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sources & Grounding</span>
            <div className="flex flex-wrap gap-2">
              {data.sources.length > 0 ? (
                data.sources.slice(0, 3).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                  >
                    <span className="max-w-[150px] truncate">{source.title}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Aggregated from web search</span>
              )}
            </div>
          </div>
          
          <button className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share Story</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;