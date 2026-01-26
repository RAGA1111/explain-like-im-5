
import React from 'react';
import { ContentTab } from '../types';

interface Props {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

const TabNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    ContentTab.EXPLANATION,
    ContentTab.RESOURCES,
    ContentTab.PREREQUISITES,
    ContentTab.OVERVIEW
  ];

  return (
    <div className="flex justify-center gap-4 border-b-4 border-black pb-1 w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              px-6 py-2 rounded-t-xl transition-all duration-200 mario-font text-[10px] sm:text-xs whitespace-nowrap border-t-4 border-x-4 border-black flex-1 text-center max-w-xs
              ${isActive 
                ? 'bg-slate-800 text-blue-400 -translate-y-1 shadow-[4px_0px_0px_#000]' 
                : 'bg-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }
            `}
          >
            {tab.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
