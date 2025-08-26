'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { djAIAPI, TrackAnalysis } from '../lib/api';

interface FileUploadProps {
  onFileSelected: (file: File, audioUrl: string) => void;
  onAnalysisComplete?: (analysis: TrackAnalysis) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  onAnalysisComplete,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TrackAnalysis | null>(null);

  const supportedFormats = ['mp3', 'wav', 'flac', 'm4a'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return 'File size must be less than 50MB';
    }

    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      return `Unsupported format. Please use: ${supportedFormats.join(', ')}`;
    }

    return null;
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setAnalysis(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create audio URL for waveform display
    const audioUrl = URL.createObjectURL(file);
    onFileSelected(file, audioUrl);

    // Start AI analysis
    setIsAnalyzing(true);
    try {
      const analysisResult = await djAIAPI.analyzeTrack(file);
      setAnalysis(analysisResult);
      onAnalysisComplete?.(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze track. Please check if the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onFileSelected, onAnalysisComplete]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Audio Track</h2>
      
      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          Drag & drop your audio file here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse files
        </p>
        
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          Choose File
          <input
            type="file"
            accept=".mp3,.wav,.flac,.m4a"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        
        <p className="text-xs text-gray-500 mt-4">
          Supported formats: {supportedFormats.join(', ')} (max 50MB)
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-800">Analyzing track with AI...</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">Analysis Complete</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">BPM:</span>
              <div className="font-semibold">{analysis.bpm.toFixed(1)}</div>
            </div>
            <div>
              <span className="text-gray-600">Key:</span>
              <div className="font-semibold">{analysis.key}</div>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <div className="font-semibold">
                {Math.floor(analysis.duration / 60)}:
                {Math.floor(analysis.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Confidence:</span>
              <div className="font-semibold">
                {(analysis.features.tempo_confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
