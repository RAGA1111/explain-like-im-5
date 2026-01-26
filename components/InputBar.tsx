
import React, { useState } from 'react';

interface Props {
  onSubmit: (topic: string) => void;
}

const InputBar: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center z-50 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative group flex flex-col"
        >
          {/* Main Container: Solid White/Grey Block */}
          <div className="relative w-full flex items-center bg-slate-200 p-2 rounded-xl border-4 border-black shadow-[10px_10px_0px_#000]">
            {/* Inner Shading for Block Effect */}
            <div className="absolute inset-0 border-t-4 border-l-4 border-white rounded-lg pointer-events-none"></div>
            
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ENTER TOPIC NAME..."
              className="w-full px-6 py-4 bg-white rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none mario-font text-[10px] sm:text-xs tracking-widest pr-20 border-4 border-slate-300"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="absolute right-4 p-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none border-4 border-black"
            >
              <span className="mario-font text-[10px] sm:text-xs">GO!</span>
            </button>
          </div>
          
          {/* Optional bottom label to complete the look */}
          <div className="mario-font text-[8px] text-slate-100 mt-4 text-center tracking-widest uppercase drop-shadow-[2px_2px_0px_#000]">
            Press GO! to start the quest
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
