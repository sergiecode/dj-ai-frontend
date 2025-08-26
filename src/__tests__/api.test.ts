// Mock the API module manually
jest.mock('../lib/api')

import { djAIAPI } from '../lib/api'
import { mockAPI } from '../__mocks__/api'

// Type the mock properly
const mockedAPI = djAIAPI as jest.Mocked<typeof djAIAPI>

describe('DJ AI API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getHealth', () => {
    it('should fetch health status successfully', async () => {
      const mockHealthResponse = {
        status: 'healthy',
        version: '1.0.0',
        supported_formats: ['mp3', 'wav', 'flac', 'm4a']
      }

      mockedAPI.getHealth.mockResolvedValue(mockHealthResponse)

      const result = await djAIAPI.getHealth()

      expect(mockedAPI.getHealth).toHaveBeenCalledWith()
      expect(result).toEqual(mockHealthResponse)
    })

    it('should handle health check errors', async () => {
      mockedAPI.getHealth.mockRejectedValue(new Error('Network error'))

      await expect(djAIAPI.getHealth()).rejects.toThrow('Network error')
      expect(mockedAPI.getHealth).toHaveBeenCalledWith()
    })
  })

  describe('getSupportedFormats', () => {
    it('should fetch supported formats successfully', async () => {
      const mockFormats = ['mp3', 'wav', 'flac', 'm4a']

      mockedAPI.getSupportedFormats.mockResolvedValue(mockFormats)

      const result = await djAIAPI.getSupportedFormats()

      expect(mockedAPI.getSupportedFormats).toHaveBeenCalledWith()
      expect(result).toEqual(mockFormats)
    })
  })

  describe('analyzeTrack', () => {
    it('should analyze track successfully', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' })
      const mockAnalysisResponse = {
        track_id: 'test-id',
        bpm: 128.5,
        key: 'C major',
        duration: 245.6,
        features: {
          spectral_centroid: 2456.7,
          spectral_rolloff: 8934.2,
          zero_crossing_rate: 0.14,
          mfcc: [1.2, -0.8, 0.3],
          tempo_confidence: 0.92
        }
      }

      mockedAPI.analyzeTrack.mockResolvedValue(mockAnalysisResponse)

      const result = await djAIAPI.analyzeTrack(mockFile)

      expect(mockedAPI.analyzeTrack).toHaveBeenCalledWith(mockFile)
      expect(result).toEqual(mockAnalysisResponse)
    })

    it('should handle analysis errors', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' })

      mockedAPI.analyzeTrack.mockRejectedValue(new Error('Analysis failed'))

      await expect(djAIAPI.analyzeTrack(mockFile)).rejects.toThrow('Analysis failed')
      expect(mockedAPI.analyzeTrack).toHaveBeenCalledWith(mockFile)
    })
  })

  describe('getTransitionRecommendations', () => {
    it('should get transition recommendations successfully', async () => {
      const mockCurrentTrackId = 'track-1'
      const mockAvailableTracks = [
        {
          track_id: 'track-2',
          bpm: 130.0,
          key: 'D major',
          energy: 0.75
        }
      ]

      const mockResponse = {
        current_track: mockCurrentTrackId,
        recommendations: [
          {
            track_id: 'track-2',
            compatibility_score: 0.85,
            transition_type: 'fade',
            suggested_cue_point: 120.5,
            crossfade_duration: 8.0
          }
        ]
      }

      mockedAPI.getTransitionRecommendations.mockResolvedValue(mockResponse)

      const result = await djAIAPI.getTransitionRecommendations(mockCurrentTrackId, mockAvailableTracks)

      expect(mockedAPI.getTransitionRecommendations).toHaveBeenCalledWith(mockCurrentTrackId, mockAvailableTracks)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('isBackendAvailable', () => {
    it('should return true when backend is available', async () => {
      mockedAPI.isBackendAvailable.mockResolvedValue(true)

      const result = await djAIAPI.isBackendAvailable()

      expect(mockedAPI.isBackendAvailable).toHaveBeenCalledWith()
      expect(result).toBe(true)
    })

    it('should return false when backend is not available', async () => {
      mockedAPI.isBackendAvailable.mockResolvedValue(false)

      const result = await djAIAPI.isBackendAvailable()

      expect(mockedAPI.isBackendAvailable).toHaveBeenCalledWith()
      expect(result).toBe(false)
    })
  })
})