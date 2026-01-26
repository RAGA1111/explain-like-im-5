
import React from 'react';
import { LearningLevel } from '../types';

interface Props {
  activeLevel: LearningLevel;
  onLevelChange: (level: LearningLevel) => void;
}

const LevelSelector: React.FC<Props> = ({ activeLevel, onLevelChange }) => {
  const levels = [
    { type: LearningLevel.BEGINNER, color: 'bg-red-600', label: '🍄' },
    { type: LearningLevel.INTERMEDIATE, color: 'bg-green-600', label: '🔥' },
    { type: LearningLevel.ADVANCED, color: 'bg-yellow-500', label: '⭐' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 px-4">
      {levels.map((level) => {
        const isActive = activeLevel === level.type;
        return (
          <button
            key={level.type}
            onClick={() => onLevelChange(level.type)}
            className={`
              relative w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center transition-all duration-200 transform
              ${isActive 
                ? 'scale-110 -translate-y-1 translate-x-1 shadow-none' 
                : 'hover:scale-105 shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none'
              }
              ${level.color} rounded-xl border-4 border-black
            `}
          >
            <span className="text-3xl mb-1">{level.label}</span>
            <span className="mario-font text-[8px] text-white tracking-tighter">
              {level.type}
            </span>
            {isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-black animate-bounce flex items-center justify-center">
                 <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            )}
            {/* Inner highlights to give it depth */}
            <div className="absolute inset-0 border-t-4 border-l-4 border-white/30 rounded-lg pointer-events-none"></div>
            <div className="absolute inset-0 border-b-4 border-r-4 border-black/20 rounded-lg pointer-events-none"></div>
          </button>
        );
      })}
    </div>
  );
};

export default LevelSelector;
