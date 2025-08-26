'use client';

import React, { useState } from 'react';
import { Music2, Headphones, Cpu } from 'lucide-react';
import WaveformPlayer from '../components/WaveformPlayer';
import FileUpload from '../components/FileUpload';
import Crossfader from '../components/Crossfader';
import { TrackAnalysis } from '../lib/api';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [trackAnalysis, setTrackAnalysis] = useState<TrackAnalysis | null>(null);
  const [trackAVolume, setTrackAVolume] = useState(1);
  const [trackBVolume, setTrackBVolume] = useState(1);

  const handleFileSelected = (file: File, url: string) => {
    setAudioFile(file);
    setAudioUrl(url);
  };

  const handleAnalysisComplete = (analysis: TrackAnalysis) => {
    setTrackAnalysis(analysis);
  };

  const handleCrossfaderChange = (volumeA: number, volumeB: number) => {
    setTrackAVolume(volumeA);
    setTrackBVolume(volumeB);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DJ AI Frontend</h1>
                <p className="text-sm text-gray-600">AI-Powered DJ System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Cpu className="w-4 h-4" />
              <span>By Sergie Code</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Headphones className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to the DJ AI System
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            This is an AI-powered DJ frontend that integrates with the dj-ai-core backend 
            for intelligent music analysis and mixing recommendations. Upload an audio track 
            to see waveform visualization and AI-powered analysis.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Waveform Visualization
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              AI Track Analysis
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Crossfade Simulation
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Backend Integration
            </span>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileSelected={handleFileSelected}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {/* Waveform Player Section */}
        <div className="mb-8">
          <WaveformPlayer
            audioUrl={audioUrl || undefined}
            onTrackLoaded={(duration) => console.log('Track loaded:', duration)}
            onPositionChange={(position) => console.log('Position:', position)}
          />
        </div>

        {/* Crossfader Section */}
        <div className="mb-8">
          <Crossfader
            trackAVolume={trackAVolume}
            trackBVolume={trackBVolume}
            onVolumeChange={handleCrossfaderChange}
          />
        </div>

        {/* Track Analysis Display */}
        {trackAnalysis && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              AI Analysis Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {trackAnalysis.bpm.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">BPM</div>
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {(trackAnalysis.features.tempo_confidence * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {trackAnalysis.key}
                </div>
                <div className="text-sm text-gray-600">Musical Key</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor(trackAnalysis.duration / 60)}:
                  {Math.floor(trackAnalysis.duration % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {trackAnalysis.features.spectral_centroid.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Spectral Centroid</div>
                <div className="text-xs text-gray-500 mt-1">Hz</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Advanced Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Zero Crossing Rate:</span>
                  <div className="font-medium">{trackAnalysis.features.zero_crossing_rate.toFixed(3)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Spectral Rolloff:</span>
                  <div className="font-medium">{trackAnalysis.features.spectral_rolloff.toFixed(0)} Hz</div>
                </div>
                <div>
                  <span className="text-gray-600">MFCC Features:</span>
                  <div className="font-medium">{trackAnalysis.features.mfcc.length} coefficients</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              DJ AI Frontend - Part of the complete DJ AI ecosystem
            </p>
            <p className="text-xs mt-1">
              Created by Sergie Code • Integrates with dj-ai-core backend
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
