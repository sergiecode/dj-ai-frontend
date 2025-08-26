#!/usr/bin/env python3
"""
Quick fix script for DJ AI integration issues
Run this in the dj-ai-core directory
"""
import os
import subprocess
import sys

def install_dependencies():
    """Install compatible dependencies"""
    print("🔧 Installing compatible dependencies...")
    
    # Core dependencies that should work
    core_deps = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0", 
        "python-multipart==0.0.6",
        "librosa",
        "numpy",
        "pandas",
        "python-dotenv",
        "pydub",
        "soundfile"
    ]
    
    for dep in core_deps:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", dep], check=True)
            print(f"✅ {dep} installed successfully")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {dep}")
    
    # Try essentia (optional)
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "essentia"], check=True)
        print("✅ Essentia installed successfully")
    except subprocess.CalledProcessError:
        print("⚠️ Essentia installation failed - using fallback methods")

def create_test_audio():
    """Create a simple test audio file"""
    try:
        import numpy as np
        import soundfile as sf
        
        print("🎵 Creating test audio file...")
        
        # Generate a simple sine wave
        sample_rate = 22050
        duration = 5  # seconds
        frequency = 440  # A4 note
        
        t = np.linspace(0, duration, int(sample_rate * duration))
        # Create a more complex waveform for better testing
        audio = 0.3 * (np.sin(2 * np.pi * frequency * t) + 
                      0.1 * np.sin(2 * np.pi * frequency * 2 * t))
        
        sf.write('test_audio.wav', audio, sample_rate)
        print("✅ Test audio file created: test_audio.wav")
        
        # Also create MP3 version if possible
        try:
            from pydub import AudioSegment
            audio_segment = AudioSegment.from_wav('test_audio.wav')
            audio_segment.export('test_audio.mp3', format='mp3')
            print("✅ Test MP3 file created: test_audio.mp3")
        except Exception:
            print("⚠️ Could not create MP3 version")
            
    except ImportError as e:
        print(f"⚠️ Could not create test audio - missing dependency: {e}")
    except Exception as e:
        print(f"❌ Error creating test audio: {e}")

def verify_api_endpoints():
    """Verify that API endpoints are working"""
    try:
        import requests
        import time
        
        print("🔍 Verifying API endpoints...")
        
        # Wait a moment for server to be ready
        time.sleep(2)
        
        base_url = "http://localhost:8000"
        
        # Test health endpoint
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Health endpoint working")
            else:
                print(f"⚠️ Health endpoint returned {response.status_code}")
        except Exception as e:
            print(f"❌ Health endpoint failed: {e}")
        
        # Test supported formats
        try:
            response = requests.get(f"{base_url}/supported-formats", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Supported formats: {data.get('formats', 'Unknown format')}")
            else:
                print(f"⚠️ Supported formats endpoint returned {response.status_code}")
        except Exception as e:
            print(f"❌ Supported formats endpoint failed: {e}")
            
    except ImportError:
        print("⚠️ Requests not available for endpoint verification")
    except Exception as e:
        print(f"❌ Error verifying endpoints: {e}")

def update_requirements():
    """Update requirements.txt with working versions"""
    try:
        requirements = """fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
librosa
numpy
pandas
scikit-learn
pydub
soundfile
python-dotenv
requests"""
        
        with open('requirements_fixed.txt', 'w') as f:
            f.write(requirements)
        
        print("✅ Created requirements_fixed.txt with compatible versions")
        
    except Exception as e:
        print(f"❌ Error creating requirements file: {e}")

if __name__ == "__main__":
    print("🔧 DJ AI Backend Integration Fix Script")
    print("=" * 40)
    
    # Change to script directory if needed
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir:
        os.chdir(script_dir)
    
    print(f"📁 Working directory: {os.getcwd()}")
    
    install_dependencies()
    print()
    
    create_test_audio()
    print()
    
    update_requirements()
    print()
    
    verify_api_endpoints()
    print()
    
    print("✅ Fix script completed!")
    print("🚀 Backend should now be ready for integration testing")
    print("📝 Next steps:")
    print("   1. Start the backend: uvicorn app.main:app --reload --port 8000")
    print("   2. Start the frontend in another terminal")
    print("   3. Test file upload with test_audio.wav or test_audio.mp3")
