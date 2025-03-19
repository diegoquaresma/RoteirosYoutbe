import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Sparkles, Send, Loader2, Download, RefreshCcw, Moon, Sun, LogOut, Save, Folder, Trash2, Mic, MicOff } from 'lucide-react';
import { cn } from '../utils';
import { Language, Script } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { VoiceInput } from './VoiceInput';

interface SidebarProps {
  title: string;
  setTitle: (title: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  generating: boolean;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  generateScript: () => void;
  cancelGeneration: () => void;
  downloadScript: () => void;
  resetForm: () => void;
  currentStep: number;
  script: string[];
  onSave: () => void;
  savedScripts: Script[];
  onLoadScript: (script: Script) => void;
  onDeleteScript: (id: string) => void;
}

export function Sidebar({
  title,
  setTitle,
  language,
  setLanguage,
  generating,
  darkMode,
  setDarkMode,
  generateScript,
  cancelGeneration,
  downloadScript,
  resetForm,
  currentStep,
  script,
  onSave,
  savedScripts,
  onLoadScript,
  onDeleteScript
}: SidebarProps) {
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleVoiceInput = (text: string) => {
    // Clean up the transcript to get a reasonable title
    const cleanTitle = text
      .split(/[.!?]/) // Split by sentence endings
      .filter(s => s.trim().length > 0) // Remove empty strings
      .map(s => s.trim()) // Clean up whitespace
      .join(' ') // Join back together
      .substring(0, 100); // Limit length
    
    setTitle(cleanTitle);
  };

  return (
    <div className={cn(
      "h-screen flex flex-col p-6",
      darkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="flex items-center justify-between mb-8">
        <h1 className={cn(
          "text-2xl font-bold",
          darkMode 
            ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        )}>
          Script Generator
        </h1>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSaved(!showSaved)}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              darkMode 
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            )}
          >
            <Folder size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              darkMode 
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            )}
          >
            <RefreshCcw size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              darkMode 
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            )}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              darkMode 
                ? "text-red-400 hover:text-red-300 hover:bg-gray-800"
                : "text-red-500 hover:text-red-600 hover:bg-gray-200"
            )}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>

      {showSaved ? (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-gray-900"
            )}>
              Saved Scripts
            </h2>
            <button
              onClick={() => setShowSaved(false)}
              className={cn(
                "text-sm px-3 py-1 rounded-lg",
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              Back
            </button>
          </div>
          {savedScripts.length === 0 ? (
            <p className={cn(
              "text-center py-8",
              darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              No saved scripts yet
            </p>
          ) : (
            savedScripts.map(savedScript => (
              <div
                key={savedScript.id}
                className={cn(
                  "p-4 rounded-lg space-y-2",
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    "font-medium",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    {savedScript.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadScript(savedScript)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors duration-200",
                        darkMode
                          ? "hover:bg-gray-600 text-gray-300"
                          : "hover:bg-gray-200 text-gray-600"
                      )}
                    >
                      <Folder size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteScript(savedScript.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors duration-200",
                        darkMode
                          ? "hover:bg-gray-600 text-red-400"
                          : "hover:bg-gray-200 text-red-500"
                      )}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  <p>Language: {savedScript.language}</p>
                  <p>Words: {savedScript.word_count}</p>
                  <p>Created: {new Date(savedScript.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className={cn(
              "block text-sm font-medium",
              darkMode ? "text-gray-300" : "text-gray-700"
            )}>
              Language
            </label>
            <div className="relative">
              <Globe2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode 
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                )}
                disabled={generating}
              >
                {['Português', 'Inglês', 'Espanhol', 'Francês'].map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={cn(
                "block text-sm font-medium",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Title
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className={cn(
                  "text-gray-400 hover:text-gray-300",
                  darkMode ? "hover:text-gray-200" : "hover:text-gray-600"
                )}
              >
                {showVoiceInput ? <MicOff size={16} /> : <Mic size={16} />}
              </motion.button>
            </div>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter script title..."
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode 
                    ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500"
                    : "bg-white text-gray-900 border-gray-200 placeholder-gray-400"
                )}
                disabled={generating}
              />
            </div>
            <AnimatePresence>
              {showVoiceInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <VoiceInput onTranscript={handleVoiceInput} darkMode={darkMode} language={language} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateScript}
              disabled={generating || !title.trim()}
              className={cn(
                "w-full py-2.5 rounded-lg font-medium transition-all duration-200",
                "flex items-center justify-center gap-2",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "text-white shadow-lg shadow-blue-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {generating ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {generating ? `Generating (${currentStep}/16)` : 'Generate'}
            </motion.button>

            {generating && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={cancelGeneration}
                className="w-full py-2.5 rounded-lg font-medium bg-red-500 text-white flex items-center justify-center gap-2"
              >
                <Loader2 className="animate-spin" size={18} />
                Cancel
              </motion.button>
            )}

            {script.length > 0 && !generating && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSave}
                  className="w-full py-2.5 rounded-lg font-medium bg-green-500 text-white flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadScript}
                  className="w-full py-2.5 rounded-lg font-medium bg-blue-500 text-white flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download
                </motion.button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}