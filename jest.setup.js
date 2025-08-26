import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock File and FileReader
global.File = class MockFile {
  constructor(chunks, filename, options = {}) {
    this.name = filename
    this.size = options.size || 1024
    this.type = options.type || 'audio/mp3'
  }
}

global.FileReader = class MockFileReader {
  readAsArrayBuffer() {
    this.onload({ target: { result: new ArrayBuffer(8) } })
  }
}

// Mock Audio context for Wavesurfer
global.AudioContext = class MockAudioContext {
  constructor() {
    this.destination = {}
    this.sampleRate = 44100
  }
  createAnalyser() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 2048,
      frequencyBinCount: 1024
    }
  }
  createGain() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
      gain: { value: 1 }
    }
  }
  createMediaElementSource() {
    return { connect: jest.fn(), disconnect: jest.fn() }
  }
  createScriptProcessor() {
    return { connect: jest.fn(), disconnect: jest.fn() }
  }
  decodeAudioData() {
    return Promise.resolve({
      length: 44100,
      sampleRate: 44100,
      numberOfChannels: 2,
      getChannelData: () => new Float32Array(44100)
    })
  }
}

global.webkitAudioContext = global.AudioContext

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn()
})

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(() => Promise.resolve())
})

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn()
})

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0
})

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 180
})
