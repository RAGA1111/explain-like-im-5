
import React, { useState, useEffect, useCallback } from 'react';
import { LearningLevel, ContentTab, TopicData, LevelContent } from './types';
import { fetchLevelContent, generateOverviewVisual } from './services/geminiService';
import LevelSelector from './components/LevelSelector';
import TabNavigation from './components/TabNavigation';
import ContentViewer from './components/ContentViewer';
import InputBar from './components/InputBar';
import Header from './components/Header';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<LearningLevel>(LearningLevel.BEGINNER);
  const [activeTab, setActiveTab] = useState<ContentTab>(ContentTab.EXPLANATION);
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async (currentTopic: string, level: LearningLevel) => {
    setLoading(true);
    setError(null);
    try {
      const content = await fetchLevelContent(currentTopic, level);
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
    setTopicData(null); // Clear previous data
    loadContent(newTopic, activeLevel);
  };

  const handleLevelChange = (newLevel: LearningLevel) => {
    setActiveLevel(newLevel);
    if (topic && (!topicData || !topicData.levels[newLevel])) {
      loadContent(topic, newLevel);
    }
  };

  const handleTabChange = async (newTab: ContentTab) => {
    setActiveTab(newTab);
    if (newTab === ContentTab.OVERVIEW && topic && (!topicData || !topicData.visuals[activeLevel])) {
      setLoading(true);
      try {
        const imageUrl = await generateOverviewVisual(topic, activeLevel);
        setTopicData(prev => prev ? {
          ...prev,
          visuals: { ...prev.visuals, [activeLevel]: imageUrl }
        } : null);
      } catch (err) {
        console.error("Visual generation failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-32">
      <div className="w-full max-w-4xl px-4 sm:px-6 mt-8 sm:mt-16">
        <Header />
        
        <div className="mt-10 mb-8">
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
              ) : error ? (
                <div className="text-red-400 p-4 rounded bg-red-900/20 text-center border border-red-500/30">
                  {error}
                </div>
              ) : (
                <ContentViewer 
                  tab={activeTab} 
                  level={activeLevel} 
                  data={topicData?.levels[activeLevel] || null} 
                  visual={topicData?.visuals[activeLevel] || null}
                  isLoadingVisual={loading && activeTab === ContentTab.OVERVIEW}
                />
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
              What topic should we explore today? I'll break it down from beginner to expert, just for you.
            </p>
          </div>
        )}
      </div>

      <InputBar onSubmit={handleTopicSubmit} />
    </div>
  );
};

export default App;
