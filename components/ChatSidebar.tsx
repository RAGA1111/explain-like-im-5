import React from 'react';
import { AIProvider } from '../types';

interface Props {
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  recentTopics: string[];
  activeTopic: string;
  onSelectTopic: (topic: string) => void;
  onNewChat: () => void;
  minimized: boolean;
  onToggleMinimize: () => void;
}

const ChatSidebar: React.FC<Props> = ({
  provider,
  onProviderChange,
  recentTopics,
  activeTopic,
  onSelectTopic,
  onNewChat,
  minimized,
  onToggleMinimize,
}) => {
  return (
    <aside
      className={`w-full shrink-0 glass-card rounded-2xl p-4 sm:p-5 blue-glow h-fit lg:sticky lg:top-6 transition-all ${
        minimized ? 'lg:w-20' : 'lg:w-80'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        {!minimized ? (
          <button
            onClick={onNewChat}
            className="flex-1 mr-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold border-2 border-blue-300/40 transition-colors"
          >
            + New Chat
          </button>
        ) : (
          <button
            onClick={onNewChat}
            title="New Chat"
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold border-2 border-blue-300/40 transition-colors"
          >
            +
          </button>
        )}
        <button
          onClick={onToggleMinimize}
          title={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
          className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {minimized ? '>' : '<'}
        </button>
      </div>

      {!minimized ? (
        <>
          <div className="space-y-2 mb-6">
            <label className="text-xs text-slate-400 uppercase tracking-[0.15em]">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as AIProvider)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2"
            >
              <option value={AIProvider.GEMINI}>Gemini</option>
              <option value={AIProvider.GROQ}>Groq</option>
            </select>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-3 uppercase tracking-[0.15em]">Chats</p>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {recentTopics.length ? (
                recentTopics.map((item) => {
                  const isActive = activeTopic.trim().toLowerCase() === item.trim().toLowerCase();
                  return (
                    <button
                      key={item}
                      onClick={() => onSelectTopic(item)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-blue-900/40 border-blue-500 text-blue-100'
                          : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="truncate">{item}</p>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No chats yet. Start by entering a topic below.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          {recentTopics.slice(0, 6).map((item) => (
            <button
              key={item}
              onClick={() => onSelectTopic(item)}
              title={item}
              className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-xs"
            >
              {item.trim().charAt(0).toUpperCase() || '?'}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default ChatSidebar;
