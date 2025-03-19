import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '../utils';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  darkMode: boolean;
  language: string;
}

export function VoiceInput({ onTranscript, darkMode, language }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className={cn(
        "p-4 rounded-xl text-sm",
        darkMode ? "bg-red-900/50 text-red-300" : "bg-red-50 text-red-500"
      )}>
        Browser doesn't support speech recognition.
      </div>
    );
  }

  const startListening = () => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: language === 'Português' ? 'pt-BR' : 
                language === 'Espanhol' ? 'es-ES' :
                language === 'Francês' ? 'fr-FR' : 'en-US'
    });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (transcript) {
      onTranscript(transcript);
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border",
      darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={cn(
            "p-3 rounded-full",
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : darkMode
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </motion.button>
        <span className={cn(
          "text-sm font-medium",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}>
          {isListening ? 'Listening...' : 'Click to start speaking'}
        </span>
      </div>

      {transcript && (
        <div className={cn(
          "p-3 rounded-lg text-sm",
          darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        )}>
          {transcript}
        </div>
      )}
    </div>
  );
}