import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Split from 'split.js';
import { supabase } from '../lib/supabase';
import { generateScript } from '../lib/xai';
import { Sidebar } from '../components/Sidebar';
import { MainContent } from '../components/MainContent';
import { Language, Script } from '../types';
import { toast } from 'sonner';

export function Dashboard() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<Language>('Português');
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [script, setScript] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [sectionStats, setSectionStats] = useState<Array<{ words: number; tokens: number }>>([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [controller, setController] = useState<AbortController | null>(null);
  const [savedScripts, setSavedScripts] = useState<Script[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        loadSavedScripts();
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const splitInstance = Split(['.sidebar', '.main-content'], {
      sizes: [25, 75],
      minSize: 300,
      gutterSize: 8,
      snapOffset: 0,
      dragInterval: 1,
      direction: 'horizontal',
      cursor: 'col-resize'
    });

    return () => {
      splitInstance.destroy();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const loadSavedScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedScripts(data || []);
    } catch (error) {
      console.error('Error loading scripts:', error);
      toast.error('Failed to load saved scripts');
    }
  };

  const saveScript = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('scripts').insert({
        user_id: user.id,
        title,
        language,
        content: script,
        word_count: wordCount,
        token_count: tokenCount
      });

      if (error) throw error;

      toast.success('Script saved successfully!');
      loadSavedScripts();
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error('Failed to save script');
    }
  };

  const deleteScript = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Script deleted successfully!');
      loadSavedScripts();
    } catch (error) {
      console.error('Error deleting script:', error);
      toast.error('Failed to delete script');
    }
  };

  const loadScript = (savedScript: Script) => {
    setTitle(savedScript.title);
    setLanguage(savedScript.language as Language);
    setScript(savedScript.content);
    setWordCount(savedScript.word_count);
    setTokenCount(savedScript.token_count);
    setCurrentStep(savedScript.content.length);
    
    // Calculate section stats
    const stats = savedScript.content.map(section => ({
      words: countWords(section),
      tokens: estimateTokens(section)
    }));
    setSectionStats(stats);
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const estimateTokens = (text: string) => {
    return Math.ceil(text.length / 4);
  };

  const resetForm = () => {
    setTitle('');
    setScript([]);
    setError('');
    setWordCount(0);
    setTokenCount(0);
    setElapsedTime(0);
    setCurrentStep(0);
    setSelectedSection(null);
    setSectionStats([]);
  };

  const cancelGeneration = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setGenerating(false);
      setTimerActive(false);
    }
  };

  const handleScriptProgress = (step: number, text: string) => {
    setCurrentStep(step);
    setScript(prev => {
      const newScript = [...prev];
      newScript[step - 1] = text;
      return newScript;
    });

    const words = countWords(text);
    const tokens = estimateTokens(text);

    setSectionStats(prev => {
      const newStats = [...prev];
      newStats[step - 1] = { words, tokens };
      return newStats;
    });

    setWordCount(prev => prev + words);
    setTokenCount(prev => prev + tokens);
  };

  const generateScriptContent = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setGenerating(true);
    setError('');
    setScript([]);
    setCurrentStep(0);
    setWordCount(0);
    setTokenCount(0);
    setElapsedTime(0);
    setTimerActive(true);
    setSelectedSection(null);
    setSectionStats([]);

    const newController = new AbortController();
    setController(newController);

    try {
      await generateScript(title, language, handleScriptProgress);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error('Failed to generate script');
      }
    } finally {
      setGenerating(false);
      setTimerActive(false);
      setController(null);
    }
  };

  const downloadScript = () => {
    if (script.length === 0) return;

    const content = `Title: ${title}\nLanguage: ${language}\n\n${script.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${title.replace(/\s+/g, '_')}_${language}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="sidebar">
        <Sidebar
          title={title}
          setTitle={setTitle}
          language={language}
          setLanguage={setLanguage}
          generating={generating}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          generateScript={generateScriptContent}
          cancelGeneration={cancelGeneration}
          downloadScript={downloadScript}
          resetForm={resetForm}
          currentStep={currentStep}
          script={script}
          onSave={saveScript}
          savedScripts={savedScripts}
          onLoadScript={loadScript}
          onDeleteScript={deleteScript}
        />
      </div>
      <div className="main-content">
        <MainContent
          darkMode={darkMode}
          script={script}
          generating={generating}
          currentStep={currentStep}
          sectionStats={sectionStats}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          wordCount={wordCount}
          elapsedTime={elapsedTime}
          tokenCount={tokenCount}
          language={language}
          error={error}
        />
      </div>
    </div>
  );
}