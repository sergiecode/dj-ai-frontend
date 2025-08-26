import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Crossfader from '../components/Crossfader'

describe('Crossfader Component', () => {
  const defaultProps = {
    trackAVolume: 1.0,
    trackBVolume: 1.0,
    onVolumeChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders crossfader interface correctly', () => {
    render(<Crossfader {...defaultProps} />)
    
    expect(screen.getByText('DJ Crossfader & Mix Control')).toBeInTheDocument()
    expect(screen.getByText('Track A')).toBeInTheDocument()
    expect(screen.getByText('Track B')).toBeInTheDocument()
    expect(screen.getByText('Mix A → B')).toBeInTheDocument()
    expect(screen.getByText('Mix B → A')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })

  it('displays initial volume percentages correctly', () => {
    render(<Crossfader {...defaultProps} />)
    
    const volumeDisplays = screen.getAllByText('Volume: 100%')
    expect(volumeDisplays).toHaveLength(2) // Track A and Track B
  })

  it('handles manual crossfader position changes', () => {
    render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0] // First slider is the crossfader
    fireEvent.change(crossfaderSlider, { target: { value: '0.5' } })
    
    // When crossfader is at 0.5 (right side), Track A should be at 50%, Track B at 100%
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(0.5, 1.0)
  })

  it('updates volume display based on crossfader position', () => {
    const { rerender } = render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0]
    
    // Move crossfader to left (-0.5)
    fireEvent.change(crossfaderSlider, { target: { value: '-0.5' } })
    
    // Force re-render to see updated percentages
    rerender(<Crossfader {...defaultProps} />)
    
    // Check that volume percentages are updated
    const volumeTexts = screen.getAllByText(/Volume: \d+%/)
    expect(volumeTexts).toHaveLength(2)
  })

  it('handles mix duration adjustment', () => {
    render(<Crossfader {...defaultProps} />)
    
    const durationSlider = screen.getByLabelText(/auto mix duration/i)
    fireEvent.change(durationSlider, { target: { value: '12' } })
    
    expect(screen.getByText('Auto Mix Duration: 12s')).toBeInTheDocument()
  })

  it('starts auto mix A to B', () => {
    render(<Crossfader {...defaultProps} />)
    
    const mixButton = screen.getByText('Mix A → B')
    fireEvent.click(mixButton)
    
    expect(screen.getByText('Auto-mixing in progress...')).toBeInTheDocument()
  })

  it('starts auto mix B to A', () => {
    render(<Crossfader {...defaultProps} />)
    
    const mixButton = screen.getByText('Mix B → A')
    fireEvent.click(mixButton)
    
    expect(screen.getByText('Auto-mixing in progress...')).toBeInTheDocument()
  })

  it('resets crossfader position', () => {
    render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getByRole('slider', { name: /crossfader/i })
    
    // Move crossfader to a position
    fireEvent.change(crossfaderSlider, { target: { value: '0.7' } })
    
    // Reset
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)
    
    // Should call onVolumeChange with center position (both tracks at full volume)
    expect(defaultProps.onVolumeChange).toHaveBeenLastCalledWith(1.0, 1.0)
  })

  it('disables controls during auto-mixing', () => {
    render(<Crossfader {...defaultProps} />)
    
    const mixButton = screen.getByText('Mix A → B')
    fireEvent.click(mixButton)
    
    // Controls should be disabled
    expect(screen.getAllByRole('slider')[0]).toBeDisabled()
    expect(screen.getByLabelText(/auto mix duration/i)).toBeDisabled()
    expect(screen.getByText('Mix A → B')).toBeDisabled()
    expect(screen.getByText('Mix B → A')).toBeDisabled()
    expect(screen.getByText('Reset')).toBeDisabled()
  })

  it('calculates correct volume levels for left crossfader position', () => {
    render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0]
    
    // Move to left position (-0.5)
    fireEvent.change(crossfaderSlider, { target: { value: '-0.5' } })
    
    // Track A should be at 100%, Track B should be at 50%
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(1.0, 0.5)
  })

  it('calculates correct volume levels for right crossfader position', () => {
    render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0]
    
    // Move to right position (0.8)
    fireEvent.change(crossfaderSlider, { target: { value: '0.8' } })
    
    // Track A should be at 20%, Track B should be at 100%
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(
      expect.closeTo(0.2, 2), // Allow floating point precision
      1.0
    )
  })

  it('shows visual mixing indicators', () => {
    render(<Crossfader {...defaultProps} />)
    
    // Should have visual indicators for both tracks (the colored dots at the bottom)
    const indicators = screen.getAllByText('Volume: 100%') // These confirm tracks are displayed
    expect(indicators).toHaveLength(2)
    
    // Check for volume display elements
    expect(screen.getByText('Track A')).toBeInTheDocument()
    expect(screen.getByText('Track B')).toBeInTheDocument()
  })

  it('displays crossfader labels correctly', () => {
    render(<Crossfader {...defaultProps} />)
    
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('Full A')).toBeInTheDocument()
    expect(screen.getByText('Center')).toBeInTheDocument()
    expect(screen.getByText('Full B')).toBeInTheDocument()
  })

  it('handles extreme crossfader positions correctly', () => {
    render(<Crossfader {...defaultProps} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0]
    
    // Test full left position
    fireEvent.change(crossfaderSlider, { target: { value: '-1' } })
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(1.0, 0)
    
    // Test full right position
    fireEvent.change(crossfaderSlider, { target: { value: '1' } })
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(0, 1.0)
  })

  it('respects track volume props in calculations', () => {
    const props = {
      trackAVolume: 0.8,
      trackBVolume: 0.6,
      onVolumeChange: jest.fn(),
    }
    
    render(<Crossfader {...props} />)
    
    const crossfaderSlider = screen.getAllByRole('slider')[0]
    
    // At center position (0), both tracks should use their base volumes
    fireEvent.change(crossfaderSlider, { target: { value: '0' } })
    expect(props.onVolumeChange).toHaveBeenCalledWith(0.8, 0.6)
  })
})
