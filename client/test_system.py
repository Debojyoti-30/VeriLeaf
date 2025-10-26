"""
Test script to verify the VeriLeaf AI system is working correctly
"""

import requests
import json
import time

def test_ai_system():
    """Test the complete AI system"""
    print("Testing VeriLeaf AI System...")
    print("=" * 50)
    
    base_url = "http://localhost:5000"
    
    # Test 1: Health Check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print(f"   Health check passed: {health_data['status']}")
        else:
            print(f"   Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   Health check failed: {e}")
        return False
    
    # Test 2: Metrics Info
    print("2. Testing metrics endpoint...")
    try:
        response = requests.get(f"{base_url}/metrics", timeout=5)
        if response.status_code == 200:
            metrics_data = response.json()
            print(f"   Metrics endpoint working: {len(metrics_data['metrics'])} metrics available")
        else:
            print(f"   Metrics endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   Metrics endpoint failed: {e}")
        return False
    
    # Test 3: Image Analysis
    print("3. Testing image analysis...")
    try:
        analysis_request = {
            "before_path": "../before.jpg",
            "after_path": "../after.jpg"
        }
        
        response = requests.post(
            f"{base_url}/analyze/paths",
            json=analysis_request,
            timeout=30
        )
        
        if response.status_code == 200:
            analysis_data = response.json()
            impact_score = analysis_data['impact_analysis']['impact_score']
            category = analysis_data['impact_analysis']['category']
            confidence = analysis_data['impact_analysis']['confidence']
            
            print(f"   Analysis completed successfully!")
            print(f"   Impact Score: {impact_score:.1f}/100")
            print(f"   Category: {category}")
            print(f"   Confidence: {confidence:.1f}%")
            
            # Show some key metrics
            ndvi_change = analysis_data['impact_analysis']['ndvi_change_percent']
            evi_change = analysis_data['impact_analysis']['evi_change_percent']
            print(f"   NDVI Change: {ndvi_change:+.1f}%")
            print(f"   EVI Change: {evi_change:+.1f}%")
            
        else:
            print(f"   Analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   Analysis failed: {e}")
        return False
    
    print("\nAll tests passed! VeriLeaf AI system is working correctly.")
    print("\nSystem Status:")
    print("   AI Server: Running on http://localhost:5000")
    print("   Health Check: Passed")
    print("   Metrics API: Working")
    print("   Image Analysis: Functional")
    print("   Impact Scoring: Operational")
    
    print("\nNext Steps:")
    print("   1. Start the frontend: npm run dev")
    print("   2. Open http://localhost:5173 in your browser")
    print("   3. Navigate to the Verify page")
    print("   4. Click 'Use Sample Images' to test the UI")
    
    return True

if __name__ == "__main__":
    success = test_ai_system()
    if not success:
        print("\nSome tests failed. Please check the error messages above.")
        print("Make sure the AI server is running: python start_ai_server.py")
    else:
        print("\nSystem is ready for use!")
