
import React from 'react';
import { ContentTab, LearningLevel, LevelContent } from '../types';

interface Props {
  tab: ContentTab;
  level: LearningLevel;
  data: LevelContent | null;
  visual: string | null;
  isLoadingVisual: boolean;
}

const ContentViewer: React.FC<Props> = ({ tab, level, data, visual, isLoadingVisual }) => {
  if (!data && tab !== ContentTab.OVERVIEW) return null;

  const levelColor = level === LearningLevel.BEGINNER ? 'text-red-500' : level === LearningLevel.INTERMEDIATE ? 'text-green-500' : 'text-yellow-400';

  switch (tab) {
    case ContentTab.EXPLANATION:
      return (
        <div className="prose prose-invert max-w-none">
          <div className="flex items-center space-x-3 mb-8 bg-black/40 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000]">
            <span className="text-2xl">💬</span>
            <div className="mario-font text-[10px] leading-relaxed">
              <span className={levelColor}>{level.toUpperCase()}</span> QUEST LOG:
            </div>
          </div>
          <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {data?.explanation}
          </div>
        </div>
      );

    case ContentTab.RESOURCES:
      return (
        <div className="space-y-8">
          {data && Object.entries(data.resources).map(([type, items]) => (
            <div key={type} className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h3 className="mario-font text-xs text-slate-100 capitalize mb-6 flex items-center">
                <span className="mr-3 text-lg">📦</span> {type.toUpperCase()}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {items.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative p-5 rounded-xl bg-slate-900 border-4 border-black hover:bg-slate-800 transition-all group shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    <div className="absolute top-1 left-1 w-[98%] h-2 border-t-2 border-white/10 rounded-full pointer-events-none"></div>
                    <div className="flex items-start justify-between">
                      <p className="text-blue-400 font-bold mb-2 group-hover:underline">{item.title}</p>
                      <span className="mario-font text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">GO!</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case ContentTab.PREREQUISITES:
      return (
        <div className="space-y-8">
          <div className="p-4 rounded-xl bg-yellow-500/10 border-4 border-black shadow-[4px_4px_0px_rgba(234,179,8,0.2)]">
            <p className="text-yellow-200/80 text-sm italic flex items-center">
              <span className="mr-2">⚠️</span> Complete these levels before advancing to the next world!
            </p>
          </div>
          {data?.prerequisites.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="mario-font text-[10px] text-blue-400 tracking-wider">WORLD: {group.category.toUpperCase()}</h4>
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900 border-4 border-black shadow-[4px_4px_0px_#000] group hover:bg-slate-800 transition-colors">
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                      <span className="mario-font text-[10px] text-black font-bold">?</span>
                    </div>
                    <span className="text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case ContentTab.OVERVIEW:
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {isLoadingVisual ? (
            <div className="text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center text-xl">🎨</div>
              </div>
              <p className="mario-font text-[10px] text-slate-400 animate-pulse">GENERATING LEVEL MAP...</p>
            </div>
          ) : visual ? (
            <div className="w-full space-y-8">
               <div className="relative p-2 bg-black rounded-2xl shadow-[10px_10px_0px_rgba(0,0,0,0.5)] border-4 border-slate-700">
                 <img 
                    src={visual} 
                    alt="Conceptual Overview" 
                    className="rounded-lg w-full object-cover border-4 border-black" 
                  />
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-4 border-l-4 border-white/50"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-4 border-r-4 border-white/50"></div>
               </div>
               <div className="text-center bg-blue-900/20 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
                 <p className="text-slate-400 text-sm italic font-medium">Concept breakdown visual for the {level} difficulty.</p>
               </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
               <span className="text-5xl block grayscale opacity-20">👻</span>
               <p className="mario-font text-[10px] text-slate-600 italic uppercase">Map Not Discovered Yet</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default ContentViewer;
