'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl?: string;
  onTrackLoaded?: (duration: number) => void;
  onPositionChange?: (position: number) => void;
  className?: string;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  onTrackLoaded,
  onPositionChange,
  className = '',
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#3b82f6',
      progressColor: '#1d4ed8',
      cursorColor: '#ef4444',
      barWidth: 2,
      barRadius: 3,
      height: 80,
      normalize: true,
    });

    // Event listeners
    wavesurfer.current.on('ready', () => {
      const trackDuration = wavesurfer.current?.getDuration() || 0;
      setDuration(trackDuration);
      setIsLoading(false);
      onTrackLoaded?.(trackDuration);
    });

    wavesurfer.current.on('audioprocess', () => {
      const current = wavesurfer.current?.getCurrentTime() || 0;
      setCurrentTime(current);
      onPositionChange?.(current);
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('finish', () => setIsPlaying(false));

    wavesurfer.current.on('loading', (progress) => {
      setIsLoading(progress < 100);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [onTrackLoaded, onPositionChange]);

  // Load audio when URL changes
  useEffect(() => {
    if (audioUrl && wavesurfer.current) {
      setIsLoading(true);
      wavesurfer.current.load(audioUrl);
    }
  }, [audioUrl]);

  // Update volume
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = useCallback(() => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  }, []);

  const handleStop = useCallback(() => {
    if (wavesurfer.current) {
      wavesurfer.current.stop();
      setCurrentTime(0);
    }
  }, []);

  const handleRewind = useCallback(() => {
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(0);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Track Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {audioUrl ? 'Audio Track Loaded' : 'No Track Loaded'}
        </h3>
        {isLoading && (
          <div className="text-sm text-blue-600">Loading audio...</div>
        )}
      </div>

      {/* Waveform Container */}
      <div className="mb-4 waveform-container p-4">
        <div ref={waveformRef} className="w-full" />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handleRewind}
          disabled={!audioUrl}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handlePlayPause}
          disabled={!audioUrl || isLoading}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={handleStop}
          disabled={!audioUrl}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <Volume2 className="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-sm text-gray-600 min-w-[3rem]">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Track Status */}
      {!audioUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          Upload an audio file to see the waveform visualization
        </div>
      )}
    </div>
  );
};

export default WaveformPlayer;
