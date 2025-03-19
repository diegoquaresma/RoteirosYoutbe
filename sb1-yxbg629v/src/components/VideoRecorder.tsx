import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Video, Square, Download, RefreshCw } from 'lucide-react';
import { cn } from '../utils';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void;
  darkMode: boolean;
}

export function VideoRecorder({ onRecordingComplete, darkMode }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    chunksRef.current = [];
    setIsRecording(true);

    const stream = webcamRef.current?.stream;
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        
        try {
          // Convert video to MP4 using FFmpeg
          ffmpeg.FS('writeFile', 'input.webm', await fetchFile(videoBlob));
          await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', 'output.mp4');
          const data = ffmpeg.FS('readFile', 'output.mp4');
          const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
          
          const url = URL.createObjectURL(mp4Blob);
          setVideoUrl(url);
          onRecordingComplete(mp4Blob);
        } catch (error) {
          console.error('Error processing video:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const retakeVideo = () => {
    setVideoUrl(null);
    chunksRef.current = [];
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border",
      darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    )}>
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        {!videoUrl ? (
          <Webcam
            ref={webcamRef}
            audio={true}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isRecording && !videoUrl && (
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
            <Video size={24} />
          </motion.button>
        )}

        {isRecording && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopRecording}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Square size={24} />
          </motion.button>
        )}

        {videoUrl && (
          <>
            <motion.a
              href={videoUrl}
              download="recording.mp4"
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retakeVideo}
              className={cn(
                "p-3 rounded-full",
                darkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              )}
            >
              <RefreshCw size={24} />
            </motion.button>
          </>
        )}
      </div>

      {isProcessing && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
          <p className={cn(
            "text-sm",
            darkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Processing video...
          </p>
        </div>
      )}
    </div>
  );
}