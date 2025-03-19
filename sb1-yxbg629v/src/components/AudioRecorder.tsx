import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '../utils';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  darkMode: boolean;
}

export function AudioRecorder({ onRecordingComplete, darkMode }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);

        if (waveformRef.current) {
          wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: darkMode ? '#60A5FA' : '#2563EB',
            progressColor: darkMode ? '#3B82F6' : '#1D4ED8',
            cursorColor: 'transparent',
            barWidth: 2,
            barGap: 3,
            height: 60,
            normalize: true,
          });

          wavesurferRef.current.loadBlob(audioBlob);
          wavesurferRef.current.on('ready', () => {
            setDuration(Math.floor(wavesurferRef.current?.getDuration() || 0));
          });
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    wavesurferRef.current?.play();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border",
      darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-4 mb-4">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className={cn(
              "p-3 rounded-full",
              darkMode
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Mic size={24} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopRecording}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Square size={24} />
          </motion.button>
        )}

        {audioUrl && !isRecording && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playAudio}
              className={cn(
                "p-3 rounded-full",
                darkMode
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              )}
            >
              <Play size={24} />
            </motion.button>
            <motion.a
              href={audioUrl}
              download="recording.wav"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-full",
                darkMode
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              <Download size={24} />
            </motion.a>
          </>
        )}

        {duration > 0 && (
          <span className={cn(
            "text-sm font-medium",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}>
            {formatTime(duration)}
          </span>
        )}
      </div>

      <div
        ref={waveformRef}
        className={cn(
          "rounded-lg overflow-hidden",
          darkMode ? "bg-gray-700" : "bg-gray-100"
        )}
      />
    </div>
  );
}