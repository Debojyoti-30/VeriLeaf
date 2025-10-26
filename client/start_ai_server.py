"""
Startup script for the VeriLeaf AI Pipeline
This script starts the Flask API server for vegetation analysis
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Check if required Python packages are installed"""
    # Map package names to their import names
    package_imports = {
        'numpy': 'numpy',
        'opencv-python': 'cv2',
        'Pillow': 'PIL',
        'scikit-image': 'skimage',
        'scipy': 'scipy',
        'matplotlib': 'matplotlib',
        'flask': 'flask',
        'flask-cors': 'flask_cors'
    }
    
    missing_packages = []
    
    for package_name, import_name in package_imports.items():
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(package_name)
    
    if missing_packages:
        print("Missing required packages:")
        for package in missing_packages:
            print(f"  - {package}")
        print("\nTo install missing packages, run:")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    return True

def start_server():
    """Start the Flask API server"""
    print("Starting VeriLeaf AI Pipeline...")
    
    # Check dependencies
    if not check_dependencies():
        print("Please install missing dependencies first.")
        return False
    
    # Change to the ai_pipeline directory
    ai_pipeline_dir = Path(__file__).parent / "ai_pipeline"
    if not ai_pipeline_dir.exists():
        print(f"AI pipeline directory not found: {ai_pipeline_dir}")
        return False
    
    os.chdir(ai_pipeline_dir)
    
    # Start the Flask server
    try:
        print("Starting Flask API server on http://localhost:5000")
        print("Vegetation analysis endpoints available:")
        print("   - POST /analyze - Upload and analyze images")
        print("   - POST /analyze/paths - Analyze by file paths")
        print("   - GET /health - Health check")
        print("   - GET /metrics - Available metrics info")
        print("\nPress Ctrl+C to stop the server")
        print("-" * 50)
        
        # Run the API server
        subprocess.run([sys.executable, "api_server.py"])
        
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_server()
