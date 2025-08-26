/**
 * Utility functions for the DJ AI Frontend
 * These are helper functions used throughout the application
 */

/**
 * Format seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Validate audio file format
 */
export const isValidAudioFormat = (filename: string): boolean => {
  const supportedFormats = ['mp3', 'wav', 'flac', 'm4a']
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? supportedFormats.includes(extension) : false
}

/**
 * Validate file size (max 50MB)
 */
export const isValidFileSize = (size: number): boolean => {
  const maxSize = 50 * 1024 * 1024 // 50MB in bytes
  return size <= maxSize
}

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Calculate crossfader volume levels
 */
export const calculateCrossfaderVolumes = (
  position: number, 
  trackAVolume: number, 
  trackBVolume: number
): { volumeA: number; volumeB: number } => {
  let volumeA: number
  let volumeB: number

  if (position <= 0) {
    // Left side - Track A dominant
    volumeA = trackAVolume
    volumeB = Math.max(0, trackBVolume * (1 + position))
  } else {
    // Right side - Track B dominant
    volumeA = Math.max(0, trackAVolume * (1 - position))
    volumeB = trackBVolume
  }

  return { volumeA, volumeB }
}

/**
 * Generate a unique track ID
 */
export const generateTrackId = (): string => {
  return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if a string is a valid BPM value
 */
export const isValidBPM = (bpm: number): boolean => {
  return bpm >= 60 && bpm <= 200 // Reasonable BPM range for most music
}

/**
 * Check if backend URL is valid
 */
export const isValidBackendUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    // Ensure it has a proper protocol (http or https) and hostname
    return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && urlObj.hostname.length > 0
  } catch {
    return false
  }
}
