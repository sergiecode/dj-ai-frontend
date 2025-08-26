import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WaveformPlayer from '../components/WaveformPlayer'

// Mock Wavesurfer.js
const mockWaveSurfer = {
  load: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  playPause: jest.fn(),
  seekTo: jest.fn(),
  setVolume: jest.fn(),
  getDuration: jest.fn().mockReturnValue(180),
  getCurrentTime: jest.fn().mockReturnValue(0),
  destroy: jest.fn(),
  on: jest.fn(),
}

let readyCallback: (() => void) | null = null

jest.mock('wavesurfer.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => {
      // When the instance is created, handle all events
      mockWaveSurfer.on.mockImplementation((event: string, callback: (...args: number[]) => void) => {
        if (event === 'ready') {
          readyCallback = callback as () => void
          // Trigger ready immediately for tests
          setTimeout(() => callback(), 0)
        } else if (event === 'audioprocess') {
          // Store audioprocess callback for position tracking tests
          setTimeout(() => callback(0), 0) // Mock current time of 0
        } else if (event === 'play') {
          // Mock play event
          setTimeout(() => callback(), 0)
        } else if (event === 'pause') {
          // Mock pause event
          setTimeout(() => callback(), 0)
        }
      })
      return mockWaveSurfer
    })
  }
}))

const mockCreate = (jest.requireMock('wavesurfer.js').default.create) as jest.MockedFunction<() => typeof mockWaveSurfer>

describe('WaveformPlayer Component', () => {
  const defaultProps = {
    audioUrl: 'test-audio.mp3',
    onTrackLoaded: jest.fn(),
    onPositionChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreate.mockClear()
    readyCallback = null
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    expect(screen.getByText('Audio Track Loaded')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('renders no track loaded state when no audioUrl provided', () => {
    render(<WaveformPlayer />)
    
    expect(screen.getByText('No Track Loaded')).toBeInTheDocument()
    expect(screen.getByText('Upload an audio file to see the waveform visualization')).toBeInTheDocument()
  })

  it('initializes WaveSurfer when component mounts', () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    expect(mockCreate).toHaveBeenCalled()
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('ready', expect.any(Function))
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('audioprocess', expect.any(Function))
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('play', expect.any(Function))
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('pause', expect.any(Function))
  })

  it('loads audio when audioUrl is provided', async () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    await waitFor(() => {
      expect(mockWaveSurfer.load).toHaveBeenCalledWith('test-audio.mp3')
    })
  })

  it('handles play/pause button click', async () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    // Wait for the component to initialize and finish loading
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled()
    })
    
    // Wait for loading to finish by checking the loading text is gone
    await waitFor(() => {
      expect(screen.queryByText('Loading audio...')).not.toBeInTheDocument()
    })
    
    const playButton = screen.getByRole('button', { name: /play/i })
    expect(playButton).not.toBeDisabled()
    fireEvent.click(playButton)
    
    expect(mockWaveSurfer.playPause).toHaveBeenCalled()
  })

  it('handles stop button click', () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    const stopButton = screen.getByRole('button', { name: /stop/i })
    fireEvent.click(stopButton)
    
    expect(mockWaveSurfer.stop).toHaveBeenCalled()
  })

  it('handles rewind button click', () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    const rewindButton = screen.getByRole('button', { name: /rewind/i })
    fireEvent.click(rewindButton)
    
    expect(mockWaveSurfer.seekTo).toHaveBeenCalledWith(0)
  })

  it('handles volume change', () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    const volumeSlider = screen.getByRole('slider')
    fireEvent.change(volumeSlider, { target: { value: '0.8' } })
    
    expect(mockWaveSurfer.setVolume).toHaveBeenCalledWith(0.8)
  })

  it('disables buttons when no audio is loaded', () => {
    render(<WaveformPlayer />)
    
    const playButton = screen.getByRole('button', { name: /play/i })
    const stopButton = screen.getByRole('button', { name: /stop/i })
    const rewindButton = screen.getByRole('button', { name: /rewind/i })
    
    expect(playButton).toBeDisabled()
    expect(stopButton).toBeDisabled()
    expect(rewindButton).toBeDisabled()
  })

  it('calls onTrackLoaded when track is ready', async () => {
    const onTrackLoaded = jest.fn()
    
    mockWaveSurfer.on.mockImplementation((event, callback) => {
      if (event === 'ready') {
        setTimeout(() => callback(), 0)
      }
    })
    
    render(<WaveformPlayer {...defaultProps} onTrackLoaded={onTrackLoaded} />)
    
    await waitFor(() => {
      expect(onTrackLoaded).toHaveBeenCalledWith(180)
    })
  })

  it('calls onPositionChange during playback', async () => {
    const onPositionChange = jest.fn()
    
    render(<WaveformPlayer {...defaultProps} onPositionChange={onPositionChange} />)

    // Wait for the component to initialize and events to be set up
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled()
    })
    
    // The audioprocess event should trigger and call onPositionChange
    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalledWith(0)
    })
  })

  it('formats time correctly', async () => {
    render(<WaveformPlayer {...defaultProps} />)
    
    // Wait for the ready event to fire and duration to be set
    await waitFor(() => {
      expect(screen.getByText('3:00')).toBeInTheDocument()
    })
    
    // The component should display formatted time
    const timeDisplays = screen.getAllByText('0:00')
    expect(timeDisplays[0]).toBeInTheDocument() // Current time
    expect(screen.getByText('3:00')).toBeInTheDocument() // Duration
  })

  it('shows loading state', () => {
    mockWaveSurfer.on.mockImplementation((event, callback) => {
      if (event === 'loading') {
        setTimeout(() => callback(50), 0) // 50% loaded
      }
    })
    
    render(<WaveformPlayer {...defaultProps} />)
    
    expect(screen.getByText('Loading audio...')).toBeInTheDocument()
  })

  it('cleans up WaveSurfer on unmount', () => {
    const { unmount } = render(<WaveformPlayer {...defaultProps} />)
    
    unmount()
    
    expect(mockWaveSurfer.destroy).toHaveBeenCalled()
  })
})
