/**
 * DJ AI Core API Integration
 * API client for communicating with the dj-ai-core backend service
 * Based on the integration specifications in the backend documentation
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for audio processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on backend API responses
export interface TrackAnalysis {
  track_id: string;
  bpm: number;
  key: string;
  duration: number;
  features: {
    spectral_centroid: number;
    spectral_rolloff: number;
    zero_crossing_rate: number;
    mfcc: number[];
    tempo_confidence: number;
  };
}

export interface Track {
  track_id: string;
  bpm: number;
  key: string;
  energy: number;
}

export interface TransitionRecommendation {
  track_id: string;
  compatibility_score: number;
  transition_type: string;
  suggested_cue_point: number;
  crossfade_duration: number;
}

export interface TransitionResponse {
  current_track: string;
  recommendations: TransitionRecommendation[];
}

export interface HealthResponse {
  status: string;
  version: string;
  supported_formats: string[];
}

// API Functions
export const djAIAPI = {
  // Health check and service info
  async getHealth(): Promise<HealthResponse> {
    const response = await api.get('/health');
    return response.data;
  },

  // Get supported audio formats
  async getSupportedFormats(): Promise<string[]> {
    const response = await api.get('/supported-formats');
    return response.data;
  },

  // Upload and analyze audio track
  async analyzeTrack(file: File): Promise<TrackAnalysis> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/analyze-track', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get transition recommendations
  async getTransitionRecommendations(
    currentTrackId: string,
    availableTracks: Track[]
  ): Promise<TransitionResponse> {
    const response = await api.post('/recommend-transitions', {
      current_track_id: currentTrackId,
      available_tracks: availableTracks,
    });
    
    return response.data;
  },

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      await api.get('/');
      return true;
    } catch (error) {
      console.warn('Backend not available:', error);
      return false;
    }
  },
};

// Export API instance for custom requests
export { api };
export default djAIAPI;
