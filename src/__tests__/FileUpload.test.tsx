import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import FileUpload from '../components/FileUpload'
import { djAIAPI } from '../lib/api'

// Mock the API
jest.mock('../lib/api', () => ({
  djAIAPI: {
    analyzeTrack: jest.fn()
  }
}))

const mockDjAIAPI = djAIAPI as jest.Mocked<typeof djAIAPI>

describe('FileUpload Component', () => {
  const defaultProps = {
    onFileSelected: jest.fn(),
    onAnalysisComplete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mocked-blob-url')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('Upload Audio Track')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop your audio file here')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
    expect(screen.getByText('Supported formats: mp3, wav, flac, m4a (max 50MB)')).toBeInTheDocument()
  })

  it('handles file selection via input', async () => {
    const user = userEvent.setup()
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mp3', size: 1024 })
    const input = screen.getByLabelText(/choose file/i)
    
    await user.upload(input, file)
    
    expect(defaultProps.onFileSelected).toHaveBeenCalledWith(file, 'mocked-blob-url')
  })

  it('handles file drop', async () => {
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mp3', size: 1024 })
    const dropZone = screen.getByText(/drag & drop/i).closest('div')
    
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file]
      }
    })
    
    await waitFor(() => {
      expect(defaultProps.onFileSelected).toHaveBeenCalledWith(file, 'mocked-blob-url')
    })
  })

  it('validates file size', async () => {
    const user = userEvent.setup()
    render(<FileUpload {...defaultProps} />)
    
    // Create a file larger than 50MB
    const largeFile = new File(['test'], 'large.mp3', { 
      type: 'audio/mp3', 
      size: 51 * 1024 * 1024 // 51MB
    })
    
    const input = screen.getByLabelText(/choose file/i)
    await user.upload(input, largeFile)
    
    expect(screen.getByText('File size must be less than 50MB')).toBeInTheDocument()
    expect(defaultProps.onFileSelected).not.toHaveBeenCalled()
  })

  it('validates file format', async () => {
    render(<FileUpload {...defaultProps} />)
    
    // Create a file with .txt extension to trigger format validation
    const unsupportedFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement
    
    // Manually trigger file input change with the unsupported file
    Object.defineProperty(input, 'files', {
      value: [unsupportedFile],
      writable: false,
    })
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(screen.getByText('Unsupported format. Please use: mp3, wav, flac, m4a')).toBeInTheDocument()
    })
    expect(defaultProps.onFileSelected).not.toHaveBeenCalled()
  })

  it('performs AI analysis after file selection', async () => {
    const user = userEvent.setup()
    const mockAnalysisResult = {
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
    
    // Add a delay to the mock to simulate async processing
    mockDjAIAPI.analyzeTrack.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve(mockAnalysisResult), 100)
      )
    )
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mp3' })
    // Mock the size property
    Object.defineProperty(file, 'size', { value: 1024, writable: false })
    
    const input = screen.getByLabelText(/choose file/i)
    
    await user.upload(input, file)
    
    // Should show analyzing state
    await waitFor(() => {
      expect(screen.getByText('Analyzing track with AI...')).toBeInTheDocument()
    })
    
    // Wait for analysis to complete
    await waitFor(() => {
      expect(mockDjAIAPI.analyzeTrack).toHaveBeenCalledWith(file)
      expect(defaultProps.onAnalysisComplete).toHaveBeenCalledWith(mockAnalysisResult)
    })
    
    // Should show analysis results
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument()
    expect(screen.getByText('128.5')).toBeInTheDocument() // BPM
    expect(screen.getByText('C major')).toBeInTheDocument() // Key
    expect(screen.getByText('92.0%')).toBeInTheDocument() // Confidence
  })

  it('handles analysis errors gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    mockDjAIAPI.analyzeTrack.mockRejectedValue(new Error('Analysis failed'))
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mp3' })
    // Mock the size property
    Object.defineProperty(file, 'size', { value: 1024, writable: false })
    
    const input = screen.getByLabelText(/choose file/i)
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to analyze track. Please check if the backend is running.')).toBeInTheDocument()
    })
    
    consoleErrorSpy.mockRestore()
  })

  it('handles drag and drop visual feedback', () => {
    render(<FileUpload {...defaultProps} />)
    
    const dropZone = screen.getByText(/drag & drop/i).closest('div')
    
    // Drag over
    fireEvent.dragOver(dropZone!)
    expect(dropZone).toHaveClass('border-blue-500', 'bg-blue-50')
    
    // Drag leave
    fireEvent.dragLeave(dropZone!)
    expect(dropZone).not.toHaveClass('border-blue-500', 'bg-blue-50')
  })

  it('displays analysis results correctly', async () => {
    const user = userEvent.setup()
    const mockAnalysisResult = {
      track_id: 'test-id',
      bpm: 120.0,
      key: 'A minor',
      duration: 180.5,
      features: {
        spectral_centroid: 2000.0,
        spectral_rolloff: 8000.0,
        zero_crossing_rate: 0.15,
        mfcc: [1.0, -0.5, 0.2],
        tempo_confidence: 0.95
      }
    }
    
    mockDjAIAPI.analyzeTrack.mockResolvedValue(mockAnalysisResult)
    
    render(<FileUpload {...defaultProps} />)
    
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mp3' })
    // Mock the size property
    Object.defineProperty(file, 'size', { value: 1024, writable: false })
    
    const input = screen.getByLabelText(/choose file/i)
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText('120.0')).toBeInTheDocument() // BPM
      expect(screen.getByText('A minor')).toBeInTheDocument() // Key
      expect(screen.getByText('3:00')).toBeInTheDocument() // Duration (180 seconds = 3:00)
      expect(screen.getByText('95.0%')).toBeInTheDocument() // Confidence
    })
  })

  it('accepts only supported file types in input', () => {
    render(<FileUpload {...defaultProps} />)
    
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement
    expect(input.accept).toBe('.mp3,.wav,.flac,.m4a')
  })
})
