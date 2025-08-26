import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../app/page'

// Mock the components
jest.mock('../components/WaveformPlayer', () => {
  return function MockWaveformPlayer() {
    return <div data-testid="waveform-player">Mocked WaveformPlayer</div>
  }
})

jest.mock('../components/FileUpload', () => {
  return function MockFileUpload() {
    return <div data-testid="file-upload">Mocked FileUpload</div>
  }
})

jest.mock('../components/Crossfader', () => {
  return function MockCrossfader() {
    return <div data-testid="crossfader">Mocked Crossfader</div>
  }
})

describe('Home Page', () => {
  it('renders the main DJ AI interface', () => {
    render(<Home />)
    
    // Check header elements
    expect(screen.getByText('DJ AI Frontend')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered DJ System')).toBeInTheDocument()
    expect(screen.getByText('By Sergie Code')).toBeInTheDocument()
  })

  it('renders welcome section with features', () => {
    render(<Home />)
    
    expect(screen.getByText('Welcome to the DJ AI System')).toBeInTheDocument()
    expect(screen.getByText(/AI-powered DJ frontend that integrates/)).toBeInTheDocument()
    
    // Check feature badges
    expect(screen.getByText('Waveform Visualization')).toBeInTheDocument()
    expect(screen.getByText('AI Track Analysis')).toBeInTheDocument()
    expect(screen.getByText('Crossfade Simulation')).toBeInTheDocument()
    expect(screen.getByText('Backend Integration')).toBeInTheDocument()
  })

  it('renders all main components', () => {
    render(<Home />)
    
    // Check that all main components are rendered
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    expect(screen.getByTestId('waveform-player')).toBeInTheDocument()
    expect(screen.getByTestId('crossfader')).toBeInTheDocument()
  })

  it('renders footer with project information', () => {
    render(<Home />)
    
    expect(screen.getByText('DJ AI Frontend - Part of the complete DJ AI ecosystem')).toBeInTheDocument()
    expect(screen.getByText('Created by Sergie Code • Integrates with dj-ai-core backend')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Home />)
    
    // Check for semantic HTML elements
    expect(screen.getByRole('banner')).toBeInTheDocument() // header
    expect(screen.getByRole('main')).toBeInTheDocument() // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
  })

  it('displays proper page title and branding', () => {
    render(<Home />)
    
    // Check main title
    const mainTitle = screen.getByRole('heading', { level: 1 })
    expect(mainTitle).toHaveTextContent('DJ AI Frontend')
    
    // Check subtitle
    expect(screen.getByText('AI-Powered DJ System')).toBeInTheDocument()
  })

  it('has responsive design classes', () => {
    const { container } = render(<Home />)
    
    // Check that container has responsive classes
    const mainContainer = container.querySelector('.max-w-7xl')
    expect(mainContainer).toBeInTheDocument()
    
    // Check for responsive padding classes
    const responsiveElement = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8')
    expect(responsiveElement).toBeInTheDocument()
  })

  it('uses proper background styling', () => {
    const { container } = render(<Home />)
    
    // Check for gradient background
    const backgroundElement = container.querySelector('.bg-gradient-to-br')
    expect(backgroundElement).toBeInTheDocument()
  })
})
