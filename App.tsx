
import React, { useState, useEffect, useCallback } from 'react';
import { LearningLevel, ContentTab, TopicData, AIProvider } from './types';
import { fetchLevelContent, generateOverviewVisual } from './services/geminiService';
import LevelSelector from './components/LevelSelector';
import TabNavigation from './components/TabNavigation';
import ContentViewer from './components/ContentViewer';
import InputBar from './components/InputBar';
import Header from './components/Header';
import ChatSidebar from './components/ChatSidebar';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<LearningLevel>(LearningLevel.BEGINNER);
  const [activeTab, setActiveTab] = useState<ContentTab>(ContentTab.EXPLANATION);
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarMinimized, setSidebarMinimized] = useState<boolean>(false);
  const [provider, setProvider] = useState<AIProvider>(() => {
    const saved = localStorage.getItem('eli5-provider');
    const envDefault = import.meta.env.VITE_AI_PROVIDER;
    if (saved === AIProvider.GROQ || saved === AIProvider.GEMINI) {
      return saved;
    }
    return envDefault === AIProvider.GROQ ? AIProvider.GROQ : AIProvider.GEMINI;
  });
  const [recentTopics, setRecentTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('eli5-recent-topics');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eli5-provider', provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('eli5-recent-topics', JSON.stringify(recentTopics));
  }, [recentTopics]);

  const loadContent = useCallback(async (currentTopic: string, level: LearningLevel, selectedProvider: AIProvider) => {
    setLoading(true);
    setError(null);
    try {
      const content = await fetchLevelContent(currentTopic, level, selectedProvider);
      setTopicData(prev => {
        const newData = prev || { topic: currentTopic, levels: { [LearningLevel.BEGINNER]: null, [LearningLevel.INTERMEDIATE]: null, [LearningLevel.ADVANCED]: null }, visuals: { [LearningLevel.BEGINNER]: null, [LearningLevel.INTERMEDIATE]: null, [LearningLevel.ADVANCED]: null } };
        return {
          ...newData,
          levels: { ...newData.levels, [level]: content }
        };
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong fetching content.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic);
    setActiveTab(ContentTab.EXPLANATION);
    setTopicData(null); // Clear previous data
    setRecentTopics((prev) => [newTopic, ...prev.filter((item) => item.toLowerCase() !== newTopic.toLowerCase())].slice(0, 6));
    loadContent(newTopic, activeLevel, provider);
  };

  const handleNewChat = () => {
    setTopic('');
    setTopicData(null);
    setError(null);
    setActiveTab(ContentTab.EXPLANATION);
  };

  const handleLevelChange = (newLevel: LearningLevel) => {
    setActiveLevel(newLevel);
    if (topic && (!topicData || !topicData.levels[newLevel])) {
      loadContent(topic, newLevel, provider);
    }
  };

  const handleTabChange = async (newTab: ContentTab) => {
    setActiveTab(newTab);
    if (newTab === ContentTab.OVERVIEW && topic && (!topicData || !topicData.visuals[activeLevel])) {
      setLoading(true);
      try {
        const imageUrl = await generateOverviewVisual(topic, activeLevel, provider);
        setTopicData(prev => prev ? {
          ...prev,
          visuals: { ...prev.visuals, [activeLevel]: imageUrl }
        } : null);
      } catch (err: any) {
        setError(err.message || "Visual generation failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <ChatSidebar
            provider={provider}
            onProviderChange={setProvider}
            recentTopics={recentTopics}
            activeTopic={topic}
            onSelectTopic={handleTopicSubmit}
            onNewChat={handleNewChat}
            minimized={sidebarMinimized}
            onToggleMinimize={() => setSidebarMinimized((prev) => !prev)}
          />

          <main className="flex-1 min-w-0">
            <Header />

            <div className="mt-8 mb-8">
              <LevelSelector activeLevel={activeLevel} onLevelChange={handleLevelChange} />
            </div>

            {topic ? (
              <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
                
                <div className="glass-card rounded-2xl p-6 sm:p-8 blue-glow min-h-[400px]">
                  {loading && !topicData?.levels[activeLevel] ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-medium">Preparing your lesson...</p>
                    </div>
                  ) : error && !topicData?.levels[activeLevel] ? (
                    <div className="text-red-400 p-4 rounded bg-red-900/20 text-center border border-red-500/30">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {error ? (
                        <div className="text-yellow-300 p-3 rounded bg-yellow-900/20 text-center border border-yellow-600/30">
                          {error}
                        </div>
                      ) : null}
                      <ContentViewer 
                        tab={activeTab} 
                        level={activeLevel} 
                        data={topicData?.levels[activeLevel] || null} 
                        visual={topicData?.visuals[activeLevel] || null}
                        isLoadingVisual={loading && activeTab === ContentTab.OVERVIEW}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-24 text-center">
                <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100 mb-3">Welcome, Learner.</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Start a new chat from the sidebar, or enter a topic below to begin your quest.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <InputBar onSubmit={handleTopicSubmit} />
    </div>
  );
};

export default App;
