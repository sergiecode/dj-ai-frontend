'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';

interface CrossfaderProps {
  trackAVolume: number;
  trackBVolume: number;
  onVolumeChange: (trackA: number, trackB: number) => void;
  className?: string;
}

const Crossfader: React.FC<CrossfaderProps> = ({
  trackAVolume,
  trackBVolume,
  onVolumeChange,
  className = '',
}) => {
  const [crossfaderPosition, setCrossfaderPosition] = useState(0); // -1 to 1
  const [isAutoMixing, setIsAutoMixing] = useState(false);
  const [mixDuration, setMixDuration] = useState(8); // seconds

  // Update volumes based on crossfader position
  useEffect(() => {
    let volumeA, volumeB;

    if (crossfaderPosition <= 0) {
      // Left side - Track A dominant
      volumeA = 1;
      volumeB = Math.max(0, 1 + crossfaderPosition);
    } else {
      // Right side - Track B dominant
      volumeA = Math.max(0, 1 - crossfaderPosition);
      volumeB = 1;
    }

    onVolumeChange(volumeA * trackAVolume, volumeB * trackBVolume);
  }, [crossfaderPosition, trackAVolume, trackBVolume, onVolumeChange]);

  const handleCrossfaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCrossfaderPosition(value);
  };

  const resetCrossfader = () => {
    setCrossfaderPosition(0);
    setIsAutoMixing(false);
  };

  const startAutoMix = (direction: 'AtoB' | 'BtoA') => {
    setIsAutoMixing(true);
    const startPosition = crossfaderPosition;
    const endPosition = direction === 'AtoB' ? 1 : -1;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / mixDuration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newPosition = startPosition + (endPosition - startPosition) * easeProgress;
      
      setCrossfaderPosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAutoMixing(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const getCrossfaderColor = () => {
    if (crossfaderPosition < -0.1) return 'bg-blue-500';
    if (crossfaderPosition > 0.1) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        DJ Crossfader & Mix Control
      </h3>

      {/* Track Labels */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Track A</div>
          <div className="text-xs text-gray-500">
            Volume: {Math.round((crossfaderPosition <= 0 ? 1 : Math.max(0, 1 - crossfaderPosition)) * 100)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Track B</div>
          <div className="text-xs text-gray-500">
            Volume: {Math.round((crossfaderPosition >= 0 ? 1 : Math.max(0, 1 + crossfaderPosition)) * 100)}%
          </div>
        </div>
      </div>

      {/* Crossfader Slider */}
      <div className="relative mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-blue-600 font-medium">A</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={crossfaderPosition}
              onChange={handleCrossfaderChange}
              disabled={isAutoMixing}
              className={`w-full h-3 rounded-lg appearance-none cursor-pointer slider ${getCrossfaderColor()}`}
              style={{
                background: `linear-gradient(to right, 
                  #3b82f6 0%, 
                  #3b82f6 ${((crossfaderPosition + 1) / 2) * 100}%, 
                  #10b981 ${((crossfaderPosition + 1) / 2) * 100}%, 
                  #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Full A</span>
              <span>Center</span>
              <span>Full B</span>
            </div>
          </div>
          <span className="text-xs text-green-600 font-medium">B</span>
        </div>
      </div>

      {/* Auto Mix Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto Mix Duration: {mixDuration}s
          </label>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={mixDuration}
            onChange={(e) => setMixDuration(parseInt(e.target.value))}
            disabled={isAutoMixing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => startAutoMix('AtoB')}
            disabled={isAutoMixing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Mix A → B
          </button>
          
          <button
            onClick={resetCrossfader}
            disabled={isAutoMixing}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
          
          <button
            onClick={() => startAutoMix('BtoA')}
            disabled={isAutoMixing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Mix B → A
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      {isAutoMixing && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center">
          <div className="animate-pulse rounded-full h-3 w-3 bg-yellow-500 mr-3"></div>
          <span className="text-yellow-800 text-sm">Auto-mixing in progress...</span>
        </div>
      )}

      {/* Visual Mixing Indicator */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className={`w-3 h-3 rounded-full transition-opacity ${
          crossfaderPosition <= 0 ? 'bg-blue-500' : 'bg-gray-300'
        }`} style={{ opacity: crossfaderPosition <= 0 ? 1 : Math.max(0, 1 - crossfaderPosition) }} />
        
        <Volume2 className="w-5 h-5 text-gray-600" />
        
        <div className={`w-3 h-3 rounded-full transition-opacity ${
          crossfaderPosition >= 0 ? 'bg-green-500' : 'bg-gray-300'
        }`} style={{ opacity: crossfaderPosition >= 0 ? 1 : Math.max(0, 1 + crossfaderPosition) }} />
      </div>
    </div>
  );
};

export default Crossfader;
