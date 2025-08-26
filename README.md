# DJ AI Frontend

**Author**: Sergie Code - Software Engineer & YouTube Programming Educator  
**Purpose**: AI-powered DJ system frontend with waveform visualization and backend integration  
**Platform**: React/Next.js with TypeScript

---

## 🎯 Project Overview

**DJ AI Frontend** is a cutting-edge React application that serves as the user interface for an AI-powered DJ system. It provides professional waveform visualization, intelligent track analysis, and seamless crossfading capabilities while integrating with the `dj-ai-core` backend for AI-powered music analysis and mixing recommendations.

### Key Features

- **🎵 Waveform Visualization**: Real-time audio waveform display using Wavesurfer.js
- **🤖 AI Integration**: Seamless communication with dj-ai-core backend for track analysis
- **🎛️ Professional DJ Controls**: Play, pause, stop, volume, and crossfade controls
- **📊 Real-time Analysis**: BPM detection, key analysis, and audio feature extraction
- **🔄 Crossfade Simulation**: Smooth transitions between tracks with auto-mix capabilities
- **📱 Responsive Design**: Modern, mobile-friendly interface with Tailwind CSS

---

## 🏗️ Architecture Overview

```
DJ AI Ecosystem Architecture:
├── dj-ai-frontend (THIS PROJECT) ← React frontend with audio visualization
├── dj-ai-core ← FastAPI backend with AI analysis
└── dj-ai-app ← Docker orchestrator (future)

Frontend Components:
├── WaveformPlayer ← Audio visualization & playback
├── FileUpload ← Drag & drop with AI analysis
├── Crossfader ← Professional mixing controls
└── API Integration ← Backend communication layer
```

---

## 📋 Technology Stack

### Core Technologies
- **Framework**: Next.js 15.5.1 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4.0 for modern design
- **Audio**: Wavesurfer.js 7.10.1 for waveform visualization
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for professional iconography

### Integration Layer
- **Backend API**: dj-ai-core (FastAPI)
- **Audio Processing**: Client-side playback + server-side AI analysis
- **File Handling**: Drag & drop with format validation
- **Real-time Updates**: Audio position tracking and analysis results

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm**: Latest version (comes with Node.js)
- **dj-ai-core**: Backend service running on port 8000 (optional for frontend development)

### Installation

```powershell
# Clone or navigate to the project directory
cd dj-ai-frontend

# Install dependencies
npm install

# Create environment configuration
# Copy .env.local.example to .env.local and configure if needed

# Start development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API** (if running): http://localhost:8000

### Development Commands

```powershell
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# TypeScript type checking
npx tsc --noEmit
```

---

## 🎛️ Component Documentation

### WaveformPlayer Component

The core audio visualization component that provides:

```tsx
<WaveformPlayer
  audioUrl={audioUrl}
  onTrackLoaded={(duration) => console.log('Duration:', duration)}
  onPositionChange={(position) => console.log('Position:', position)}
/>
```

**Features:**
- Real-time waveform rendering
- Play/pause/stop controls
- Volume adjustment
- Time tracking and display
- Responsive design

### FileUpload Component

Handles audio file upload and AI analysis:

```tsx
<FileUpload
  onFileSelected={(file, audioUrl) => setAudioData(file, audioUrl)}
  onAnalysisComplete={(analysis) => setTrackAnalysis(analysis)}
/>
```

**Features:**
- Drag & drop interface
- File format validation (mp3, wav, flac, m4a)
- Progress indicators
- AI analysis integration
- Error handling

### Crossfader Component

Professional DJ mixing controls:

```tsx
<Crossfader
  trackAVolume={1.0}
  trackBVolume={0.8}
  onVolumeChange={(volA, volB) => updateVolumes(volA, volB)}
/>
```

**Features:**
- Manual crossfader control
- Auto-mix functionality
- Smooth transitions
- Visual feedback
- Configurable mix duration

---

## 🔗 Backend Integration (dj-ai-core)

### API Communication

The frontend communicates with the dj-ai-core backend through a structured API layer:

```typescript
// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Track analysis
const analysis = await djAIAPI.analyzeTrack(audioFile);

// Transition recommendations
const recommendations = await djAIAPI.getTransitionRecommendations(
  currentTrackId,
  availableTracks
);
```

### Supported API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check and API info |
| `/health` | GET | Detailed service status |
| `/analyze-track` | POST | Upload and analyze audio files |
| `/recommend-transitions` | POST | Get AI mixing recommendations |
| `/supported-formats` | GET | List supported audio formats |

### Data Flow

1. **File Upload**: User selects audio file via drag & drop
2. **Local Playback**: File is loaded into Wavesurfer for visualization
3. **AI Analysis**: File is sent to backend for analysis
4. **Results Display**: BPM, key, and features are shown in UI
5. **Mixing**: Crossfader controls audio playback and mixing

---

## 🎵 Usage Examples

### Basic Audio Loading

```typescript
// 1. User uploads an audio file
const handleFileUpload = (file: File, audioUrl: string) => {
  setCurrentTrack({ file, audioUrl });
};

// 2. Waveform displays the audio
<WaveformPlayer audioUrl={currentTrack.audioUrl} />

// 3. AI analysis runs in background
const analysis = await djAIAPI.analyzeTrack(currentTrack.file);
```

### Professional DJ Workflow

```typescript
// 1. Load multiple tracks
const trackA = await loadTrack('song1.mp3');
const trackB = await loadTrack('song2.mp3');

// 2. Get AI recommendations
const recommendations = await djAIAPI.getTransitionRecommendations(
  trackA.track_id,
  [trackB]
);

// 3. Use crossfader for smooth mixing
<Crossfader
  trackAVolume={trackA.volume}
  trackBVolume={trackB.volume}
  onVolumeChange={handleMixing}
/>
```

### AI Analysis Results

```typescript
interface TrackAnalysis {
  track_id: string;
  bpm: number;                    // 128.5
  key: string;                    // "C major"
  duration: number;               // 245.6 seconds
  features: {
    spectral_centroid: number;    // 2456.7 Hz
    spectral_rolloff: number;     // 8934.2 Hz
    zero_crossing_rate: number;   // 0.14
    mfcc: number[];              // [1.2, -0.8, 0.3, ...]
    tempo_confidence: number;     // 0.92 (92% confidence)
  };
}
```

---

## 📁 Project Structure

```
dj-ai-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main application page
│   │   ├── layout.tsx               # App layout configuration
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── WaveformPlayer.tsx       # Audio visualization component
│   │   ├── FileUpload.tsx           # File upload with AI integration
│   │   └── Crossfader.tsx           # DJ mixing controls
│   └── lib/
│       └── api.ts                   # Backend API integration layer
├── public/                          # Static assets
├── .env.local                       # Environment configuration
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This documentation
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` file in the project root:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development Settings
NODE_ENV=development
```

### Audio Format Support

The frontend supports the same formats as the backend:
- **MP3**: Standard compressed audio
- **WAV**: Uncompressed audio (best quality)
- **FLAC**: Lossless compression
- **M4A**: Apple audio format

### File Size Limits
- **Maximum Size**: 50MB per file
- **Recommended**: < 10MB for optimal performance
- **Validation**: Client-side and server-side validation

---

## 🐳 Docker Integration (Future: dj-ai-app)

### Planned Docker Compose Configuration

```yaml
# Future integration with dj-ai-app orchestrator
services:
  dj-ai-frontend:
    build: ./dj-ai-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://dj-ai-core:8000
    depends_on:
      - dj-ai-core
    networks:
      - dj-ai-network

  dj-ai-core:
    build: ./dj-ai-core
    ports:
      - "8000:8000"
    networks:
      - dj-ai-network

networks:
  dj-ai-network:
    driver: bridge
```

---

## 🎯 Integration with dj-ai-app (Orchestrator)

This frontend is designed to be part of a larger ecosystem:

### Repository Structure (Planned)
```
dj-ai-app/                    # Main orchestrator repository
├── dj-ai-frontend/          # This repository (as submodule/subtree)
├── dj-ai-core/              # Backend API repository
├── docker-compose.yml       # Service orchestration
├── docs/                    # Comprehensive documentation
└── scripts/                 # Deployment and setup scripts
```

### Benefits of the Orchestrator
- **Unified Development**: Single command to start all services
- **Production Deployment**: Docker Compose for easy deployment
- **Environment Management**: Consistent configuration across services
- **Documentation**: Centralized documentation and tutorials
- **CI/CD Integration**: Automated testing and deployment

### Integration Commands (Future)
```powershell
# From dj-ai-app repository
git clone https://github.com/sergiecode/dj-ai-app.git
cd dj-ai-app

# Start entire system
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Documentation: http://localhost:8080
```

---

## 🎵 Final Notes

This frontend represents a professional-grade foundation for building music technology applications. It demonstrates:

- **Modern Web Development**: Latest React/Next.js patterns
- **Real-world Integration**: Practical API communication
- **Professional UI/UX**: Industry-standard design patterns
- **Educational Value**: Clear, well-documented code
- **Scalable Architecture**: Ready for future enhancements

Whether you're learning web development, building music applications, or exploring AI integration, this project provides a solid foundation and clear examples of professional development practices.

**Ready to Mix**: Load up your favorite tracks and start exploring the future of DJ technology! 🎵🤖

---

**Connect with Sergie Code**:
- 🎥 YouTube: Educational programming content
- 💻 GitHub: Open source projects and tutorials
- 🌐 Web: Professional software development services

*Empowering musicians through technology education* 🎵💻
