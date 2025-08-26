// Manual mock for the API module
export const mockAPI = {
  getHealth: jest.fn(),
  getSupportedFormats: jest.fn(),
  analyzeTrack: jest.fn(),
  getTransitionRecommendations: jest.fn(),
  isBackendAvailable: jest.fn(),
}

export const djAIAPI = mockAPI
export default mockAPI

// Export types for tests
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

export interface HealthResponse {
  status: string;
  version: string;
  supported_formats: string[];
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
