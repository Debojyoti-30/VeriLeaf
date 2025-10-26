"""
Flask API server for vegetation analysis
Provides REST endpoints for the VeriLeaf frontend
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import logging
from datetime import datetime
from vegetation_analyzer import VegetationAnalyzer
import tempfile
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize analyzer
analyzer = VegetationAnalyzer()

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tiff', 'tif'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'VeriLeaf Vegetation Analysis API'
    })

@app.route('/analyze', methods=['POST'])
def analyze_vegetation():
    """
    Analyze vegetation changes between before and after images
    Expects multipart/form-data with 'before' and 'after' image files
    """
    try:
        # Check if files are present
        if 'before' not in request.files or 'after' not in request.files:
            return jsonify({
                'error': 'Both before and after images are required',
                'status': 'error'
            }), 400
        
        before_file = request.files['before']
        after_file = request.files['after']
        
        # Check if files are selected
        if before_file.filename == '' or after_file.filename == '':
            return jsonify({
                'error': 'No files selected',
                'status': 'error'
            }), 400
        
        # Check file extensions
        if not (allowed_file(before_file.filename) and allowed_file(after_file.filename)):
            return jsonify({
                'error': 'Invalid file type. Allowed types: PNG, JPG, JPEG, TIFF',
                'status': 'error'
            }), 400
        
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Save uploaded files
        before_filename = f"{session_id}_before_{before_file.filename}"
        after_filename = f"{session_id}_after_{after_file.filename}"
        
        before_path = os.path.join(UPLOAD_FOLDER, before_filename)
        after_path = os.path.join(UPLOAD_FOLDER, after_filename)
        
        before_file.save(before_path)
        after_file.save(after_path)
        
        logger.info(f"Files saved: {before_path}, {after_path}")
        
        # Perform analysis
        results = analyzer.analyze_images(before_path, after_path)
        
        # Add session info
        results['session_id'] = session_id
        results['before_filename'] = before_filename
        results['after_filename'] = after_filename
        
        # Save results
        results_filename = f"{session_id}_results.json"
        results_path = os.path.join(RESULTS_FOLDER, results_filename)
        analyzer.save_results(results, results_path)
        
        # Clean up uploaded files (optional - you might want to keep them)
        # os.remove(before_path)
        # os.remove(after_path)
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'status': 'error',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/analyze/paths', methods=['POST'])
def analyze_vegetation_paths():
    """
    Analyze vegetation changes using file paths
    Expects JSON with 'before_path' and 'after_path'
    """
    try:
        data = request.get_json()
        
        if not data or 'before_path' not in data or 'after_path' not in data:
            return jsonify({
                'error': 'Both before_path and after_path are required',
                'status': 'error'
            }), 400
        
        before_path = data['before_path']
        after_path = data['after_path']
        
        # Check if files exist
        if not os.path.exists(before_path):
            return jsonify({
                'error': f'Before image not found: {before_path}',
                'status': 'error'
            }), 404
        
        if not os.path.exists(after_path):
            return jsonify({
                'error': f'After image not found: {after_path}',
                'status': 'error'
            }), 404
        
        # Perform analysis
        results = analyzer.analyze_images(before_path, after_path)
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'status': 'error',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/results/<session_id>', methods=['GET'])
def get_results(session_id):
    """Get analysis results by session ID"""
    try:
        results_filename = f"{session_id}_results.json"
        results_path = os.path.join(RESULTS_FOLDER, results_filename)
        
        if not os.path.exists(results_path):
            return jsonify({
                'error': 'Results not found',
                'status': 'error'
            }), 404
        
        with open(results_path, 'r') as f:
            results = json.load(f)
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error retrieving results: {str(e)}")
        return jsonify({
            'error': f'Failed to retrieve results: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/metrics', methods=['GET'])
def get_available_metrics():
    """Get list of available vegetation metrics"""
    metrics_info = {
        'ndvi': {
            'name': 'Normalized Difference Vegetation Index',
            'description': 'Measures vegetation health and density',
            'range': '-1 to 1',
            'interpretation': 'Higher values indicate healthier vegetation'
        },
        'evi': {
            'name': 'Enhanced Vegetation Index',
            'description': 'Improved version of NDVI for dense vegetation',
            'range': '-1 to 1',
            'interpretation': 'Better sensitivity in high biomass areas'
        },
        'ndwi': {
            'name': 'Normalized Difference Water Index',
            'description': 'Measures water content in vegetation',
            'range': '-1 to 1',
            'interpretation': 'Higher values indicate more water content'
        },
        'savi': {
            'name': 'Soil Adjusted Vegetation Index',
            'description': 'NDVI adjusted for soil background',
            'range': '-1 to 1',
            'interpretation': 'Better for areas with exposed soil'
        },
        'lai': {
            'name': 'Leaf Area Index',
            'description': 'Total leaf area per unit ground area',
            'range': '0 to 8',
            'interpretation': 'Higher values indicate more leaf coverage'
        },
        'fvc': {
            'name': 'Fractional Vegetation Cover',
            'description': 'Fraction of ground covered by vegetation',
            'range': '0 to 1',
            'interpretation': 'Percentage of area covered by vegetation'
        }
    }
    
    return jsonify({
        'metrics': metrics_info,
        'impact_scoring': {
            'description': 'Weighted combination of all metrics',
            'range': '0 to 100',
            'weights': {
                'ndvi': 0.35,
                'evi': 0.25,
                'fvc': 0.25,
                'lai': 0.15
            },
            'categories': {
                '80-100': 'Excellent',
                '65-79': 'Good',
                '50-64': 'Moderate',
                '35-49': 'Poor',
                '0-34': 'Very Poor'
            }
        }
    })

@app.route('/upload/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    """Serve uploaded files"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'status': 'error'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'status': 'error'
    }), 500

if __name__ == '__main__':
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting VeriLeaf Vegetation Analysis API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
