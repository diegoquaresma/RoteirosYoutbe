import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, MessageCircle, BookOpen, PenTool, CheckCircle2, Loader2, Copy, Share2, Heart, Download } from 'lucide-react';
import { cn } from '../utils';
import { toast } from 'sonner';
import { ExportMenu } from './ExportMenu';
import { exportScript, ExportFormat } from '../lib/export';

interface MainContentProps {
  darkMode: boolean;
  script: string[];
  generating: boolean;
  currentStep: number;
  sectionStats: Array<{ words: number; tokens: number }>;
  selectedSection: number | null;
  setSelectedSection: (index: number | null) => void;
  wordCount: number;
  elapsedTime: number;
  tokenCount: number;
  language: string;
  error: string;
  title: string;
}

export function MainContent({
  darkMode,
  script,
  generating,
  currentStep,
  sectionStats,
  selectedSection,
  setSelectedSection,
  wordCount,
  elapsedTime,
  tokenCount,
  language,
  error,
  title
}: MainContentProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      // Ensure title is not empty and sanitize it for filename
      const safeTitle = (title || 'untitled').trim().replace(/[^a-zA-Z0-9-_]/g, '_');
      await exportScript(safeTitle, language, script, format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export script');
    }
    setShowExportMenu(false);
  };

  const renderProgress = () => {
    if (!generating && currentStep === 0) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "mb-6 p-4 rounded-xl",
          darkMode 
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-white/80 border border-gray-200"
        )}
      >
        <div className="space-y-2">
          <div className={cn(
            "text-sm font-medium flex items-center gap-2",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}>
            <PenTool size={16} className="animate-bounce" />
            {language === 'Português' ? 'Gerando roteiro' : 'Generating script'}
          </div>
          <AnimatePresence>
            {Array.from({ length: currentStep }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  i + 1 === currentStep && generating
                    ? darkMode
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : darkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                )}
              >
                {i + 1 < currentStep && <CheckCircle2 size={14} className="text-green-500" />}
                {i + 1 === currentStep && generating && <Loader2 size={14} className="animate-spin text-blue-500" />}
                <span className="flex-1 text-sm">
                  Section {i + 1}
                  {sectionStats[i] && ` (${sectionStats[i].words} words)`}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={cn(
      "h-screen overflow-y-auto p-6",
      darkMode ? "bg-gray-800" : "bg-white"
    )}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-6 p-4 rounded-xl border text-sm",
            darkMode 
              ? "bg-red-900/50 border-red-800 text-red-300"
              : "bg-red-50 border-red-100 text-red-500"
          )}
        >
          {error}
        </motion.div>
      )}

      {renderProgress()}

      <div className={cn(
        "grid grid-cols-3 gap-4 mb-6",
        darkMode ? "text-gray-300" : "text-gray-700"
      )}>
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          darkMode ? "bg-gray-700" : "bg-gray-50"
        )}>
          <FileText className={darkMode ? "text-blue-400" : "text-blue-600"} />
          <div>
            <div className="text-sm font-medium opacity-75">Words</div>
            <div className="text-xl font-bold">{wordCount}</div>
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          darkMode ? "bg-gray-700" : "bg-gray-50"
        )}>
          <MessageCircle className={darkMode ? "text-purple-400" : "text-purple-600"} />
          <div>
            <div className="text-sm font-medium opacity-75">Time</div>
            <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          darkMode ? "bg-gray-700" : "bg-gray-50"
        )}>
          <Sparkles className={darkMode ? "text-pink-400" : "text-pink-600"} />
          <div>
            <div className="text-sm font-medium opacity-75">Tokens</div>
            <div className="text-xl font-bold">{tokenCount}</div>
          </div>
        </div>
      </div>

      {script.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className={darkMode ? "text-blue-400" : "text-blue-600"} />
              <h2 className={cn(
                "text-xl font-semibold",
                darkMode ? "text-white" : "text-gray-900"
              )}>
                Generated Script
              </h2>
            </div>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={cn(
                  "p-2 rounded-lg transition-colors duration-200",
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <Download size={18} />
              </motion.button>
              {showExportMenu && (
                <ExportMenu
                  onExport={handleExport}
                  darkMode={darkMode}
                />
              )}
            </div>
          </div>

          {script.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200",
                darkMode
                  ? selectedSection === index
                    ? "bg-gray-700 border-blue-500"
                    : "bg-gray-700/50 border-gray-600 hover:border-blue-500"
                  : selectedSection === index
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200 hover:border-blue-200"
              )}
              onClick={() => setSelectedSection(index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    Section {index + 1}
                  </span>
                  {sectionStats[index] && (
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <span>{sectionStats[index].words} words</span>
                      <span>•</span>
                      <span>{sectionStats[index].tokens} tokens</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(section);
                    }}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors duration-200",
                      darkMode 
                        ? "hover:bg-gray-600"
                        : "hover:bg-gray-200"
                    )}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors duration-200",
                      darkMode 
                        ? "hover:bg-gray-600"
                        : "hover:bg-gray-200"
                    )}
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors duration-200",
                      darkMode 
                        ? "hover:bg-gray-600"
                        : "hover:bg-gray-200"
                    )}
                  >
                    <Heart size={14} />
                  </button>
                </div>
              </div>
              <div className={cn(
                "whitespace-pre-wrap text-sm leading-relaxed",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                {section}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}