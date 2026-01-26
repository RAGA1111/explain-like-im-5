
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <div className="flex justify-center items-center space-x-4 mb-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-yellow-600 shadow-inner coin-spin">
          <div className="w-1.5 h-4 bg-yellow-600 rounded-full"></div>
        </div>
        <h1 className="mario-font text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-[4px_4px_0px_#e52521]">
          EXPLAIN LIKE I'M 5
        </h1>
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-yellow-600 shadow-inner coin-spin">
          <div className="w-1.5 h-4 bg-yellow-600 rounded-full"></div>
        </div>
      </div>
      <p className="text-slate-400 text-sm sm:text-base font-medium tracking-[0.2em] uppercase">
        Level Up Your Understanding
      </p>
    </header>
  );
};

export default Header;
