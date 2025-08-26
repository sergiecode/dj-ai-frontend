import {
  formatTime,
  isValidAudioFormat,
  isValidFileSize,
  formatFileSize,
  calculateCrossfaderVolumes,
  generateTrackId,
  isValidBPM,
  isValidBackendUrl
} from '../lib/utils'

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('formats seconds correctly', () => {
      expect(formatTime(0)).toBe('0:00')
      expect(formatTime(30)).toBe('0:30')
      expect(formatTime(60)).toBe('1:00')
      expect(formatTime(90)).toBe('1:30')
      expect(formatTime(3600)).toBe('60:00')
    })

    it('handles decimal seconds', () => {
      expect(formatTime(65.7)).toBe('1:05')
      expect(formatTime(123.9)).toBe('2:03')
    })

    it('pads single digit seconds', () => {
      expect(formatTime(5)).toBe('0:05')
      expect(formatTime(65)).toBe('1:05')
    })
  })

  describe('isValidAudioFormat', () => {
    it('accepts valid audio formats', () => {
      expect(isValidAudioFormat('song.mp3')).toBe(true)
      expect(isValidAudioFormat('track.wav')).toBe(true)
      expect(isValidAudioFormat('music.flac')).toBe(true)
      expect(isValidAudioFormat('audio.m4a')).toBe(true)
    })

    it('accepts uppercase extensions', () => {
      expect(isValidAudioFormat('song.MP3')).toBe(true)
      expect(isValidAudioFormat('track.WAV')).toBe(true)
    })

    it('rejects invalid formats', () => {
      expect(isValidAudioFormat('document.txt')).toBe(false)
      expect(isValidAudioFormat('video.mp4')).toBe(false)
      expect(isValidAudioFormat('image.jpg')).toBe(false)
    })

    it('handles files without extensions', () => {
      expect(isValidAudioFormat('filename')).toBe(false)
      expect(isValidAudioFormat('')).toBe(false)
    })
  })

  describe('isValidFileSize', () => {
    it('accepts files under 50MB', () => {
      expect(isValidFileSize(1024)).toBe(true) // 1KB
      expect(isValidFileSize(1024 * 1024)).toBe(true) // 1MB
      expect(isValidFileSize(25 * 1024 * 1024)).toBe(true) // 25MB
      expect(isValidFileSize(50 * 1024 * 1024)).toBe(true) // 50MB exactly
    })

    it('rejects files over 50MB', () => {
      expect(isValidFileSize(51 * 1024 * 1024)).toBe(false) // 51MB
      expect(isValidFileSize(100 * 1024 * 1024)).toBe(false) // 100MB
    })

    it('handles zero size', () => {
      expect(isValidFileSize(0)).toBe(true)
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('handles decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5KB
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB') // 2.5MB
    })

    it('formats large sizes', () => {
      expect(formatFileSize(50 * 1024 * 1024)).toBe('50 MB')
    })
  })

  describe('calculateCrossfaderVolumes', () => {
    it('calculates volumes for center position', () => {
      const result = calculateCrossfaderVolumes(0, 1.0, 0.8)
      expect(result.volumeA).toBe(1.0)
      expect(result.volumeB).toBe(0.8)
    })

    it('calculates volumes for left position', () => {
      const result = calculateCrossfaderVolumes(-0.5, 1.0, 1.0)
      expect(result.volumeA).toBe(1.0)
      expect(result.volumeB).toBe(0.5)
    })

    it('calculates volumes for right position', () => {
      const result = calculateCrossfaderVolumes(0.5, 1.0, 1.0)
      expect(result.volumeA).toBe(0.5)
      expect(result.volumeB).toBe(1.0)
    })

    it('handles extreme positions', () => {
      const leftExtreme = calculateCrossfaderVolumes(-1, 1.0, 1.0)
      expect(leftExtreme.volumeA).toBe(1.0)
      expect(leftExtreme.volumeB).toBe(0)

      const rightExtreme = calculateCrossfaderVolumes(1, 1.0, 1.0)
      expect(rightExtreme.volumeA).toBe(0)
      expect(rightExtreme.volumeB).toBe(1.0)
    })

    it('respects track volume levels', () => {
      const result = calculateCrossfaderVolumes(0, 0.7, 0.9)
      expect(result.volumeA).toBe(0.7)
      expect(result.volumeB).toBe(0.9)
    })
  })

  describe('generateTrackId', () => {
    it('generates unique track IDs', () => {
      const id1 = generateTrackId()
      const id2 = generateTrackId()
      
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^track_\d+_[a-z0-9]{9}$/)
      expect(id2).toMatch(/^track_\d+_[a-z0-9]{9}$/)
    })

    it('generates IDs with correct format', () => {
      const id = generateTrackId()
      expect(id).toMatch(/^track_\d+_[a-z0-9]{9}$/)
    })
  })

  describe('isValidBPM', () => {
    it('accepts valid BPM range', () => {
      expect(isValidBPM(60)).toBe(true) // Minimum
      expect(isValidBPM(120)).toBe(true) // Common
      expect(isValidBPM(200)).toBe(true) // Maximum
    })

    it('rejects invalid BPM values', () => {
      expect(isValidBPM(59)).toBe(false) // Below minimum
      expect(isValidBPM(201)).toBe(false) // Above maximum
      expect(isValidBPM(0)).toBe(false)
      expect(isValidBPM(-10)).toBe(false)
    })

    it('handles decimal BPM values', () => {
      expect(isValidBPM(128.5)).toBe(true)
      expect(isValidBPM(59.9)).toBe(false)
      expect(isValidBPM(200.1)).toBe(false)
    })
  })

  describe('isValidBackendUrl', () => {
    it('accepts valid URLs', () => {
      expect(isValidBackendUrl('http://localhost:8000')).toBe(true)
      expect(isValidBackendUrl('https://api.example.com')).toBe(true)
      expect(isValidBackendUrl('http://192.168.1.100:3000')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(isValidBackendUrl('not-a-url')).toBe(false)
      expect(isValidBackendUrl('localhost:8000')).toBe(false) // Missing protocol
      expect(isValidBackendUrl('')).toBe(false)
      expect(isValidBackendUrl('ftp://example.com')).toBe(false) // FTP is not valid for HTTP API
    })

    it('handles edge cases', () => {
      expect(isValidBackendUrl('http://')).toBe(false) // Incomplete URL
      expect(isValidBackendUrl('https://')).toBe(false) // Incomplete URL
      expect(isValidBackendUrl('://example.com')).toBe(false) // Missing protocol
    })
  })
})
