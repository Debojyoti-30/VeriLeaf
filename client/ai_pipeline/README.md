# VeriLeaf Vegetation Analysis Pipeline

This Python-based AI pipeline analyzes vegetation changes between before and after images using advanced remote sensing techniques. It calculates multiple vegetation indices and generates an environmental impact score.

## Features

- **Vegetation Indices Calculation**:
  - NDVI (Normalized Difference Vegetation Index)
  - EVI (Enhanced Vegetation Index)
  - NDWI (Normalized Difference Water Index)
  - SAVI (Soil Adjusted Vegetation Index)
  - LAI (Leaf Area Index)
  - FVC (Fractional Vegetation Cover)

- **Impact Scoring**: 0-100 scale based on weighted vegetation changes
- **REST API**: Flask-based API for frontend integration
- **Batch Processing**: Command-line tool for standalone analysis

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure you have the required image files (before.jpg and after.jpg) in the project directory.

## Usage

### 1. Command Line Analysis

Run analysis on before/after images:
```bash
python run_analysis.py before.jpg after.jpg
```

### 2. API Server

Start the Flask API server:
```bash
python api_server.py
```

The API will be available at `http://localhost:5000`

#### API Endpoints

- `GET /health` - Health check
- `POST /analyze` - Upload and analyze images (multipart/form-data)
- `POST /analyze/paths` - Analyze images by file paths (JSON)
- `GET /results/<session_id>` - Get analysis results
- `GET /metrics` - Get available metrics information

#### Example API Usage

**Upload images for analysis:**
```bash
curl -X POST -F "before=@before.jpg" -F "after=@after.jpg" http://localhost:5000/analyze
```

**Analyze by file paths:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"before_path": "before.jpg", "after_path": "after.jpg"}' \
  http://localhost:5000/analyze/paths
```

### 3. Python Library

Use the VegetationAnalyzer class directly:

```python
from vegetation_analyzer import VegetationAnalyzer

analyzer = VegetationAnalyzer()
results = analyzer.analyze_images("before.jpg", "after.jpg")
print(f"Impact Score: {results['impact_analysis']['impact_score']}")
```

## Output Format

The analysis returns a comprehensive JSON object with:

```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": "success",
  "before_metrics": {
    "ndvi_mean": 0.45,
    "evi_mean": 0.38,
    "fvc_mean": 0.52,
    "lai_mean": 2.1,
    ...
  },
  "after_metrics": {
    "ndvi_mean": 0.58,
    "evi_mean": 0.49,
    "fvc_mean": 0.68,
    "lai_mean": 2.8,
    ...
  },
  "impact_analysis": {
    "impact_score": 78.5,
    "confidence": 86.2,
    "category": "Good",
    "ndvi_change_percent": 12.4,
    "evi_change_percent": 15.2,
    "fvc_change_percent": 18.3,
    "lai_change_percent": 14.7
  }
}
```

## Impact Scoring

The impact score (0-100) is calculated using a weighted combination of vegetation changes:

- **NDVI**: 35% weight (primary vegetation health indicator)
- **EVI**: 25% weight (dense vegetation sensitivity)
- **FVC**: 25% weight (vegetation coverage)
- **LAI**: 15% weight (leaf area density)

### Score Categories:
- **80-100**: Excellent environmental impact
- **65-79**: Good environmental impact
- **50-64**: Moderate environmental impact
- **35-49**: Poor environmental impact
- **0-34**: Very poor environmental impact

## Technical Details

### Vegetation Indices

1. **NDVI** = (NIR - Red) / (NIR + Red)
   - Range: -1 to 1
   - Higher values = healthier vegetation

2. **EVI** = 2.5 × (NIR - Red) / (NIR + 6×Red - 7.5×Blue + 1)
   - Range: -1 to 1
   - Better for dense vegetation areas

3. **NDWI** = (Green - NIR) / (Green + NIR)
   - Range: -1 to 1
   - Higher values = more water content

4. **SAVI** = (NIR - Red) / (NIR + Red + L) × (1 + L)
   - Range: -1 to 1
   - Soil-adjusted for exposed soil areas

5. **LAI** = -ln(0.69 - 0.59×NDVI) / 0.91
   - Range: 0 to 8
   - Higher values = more leaf area

6. **FVC** = (NDVI - NDVI_soil) / (NDVI_veg - NDVI_soil)
   - Range: 0 to 1
   - Fraction of vegetation cover

### Image Processing

- Supports RGB images (PNG, JPG, JPEG, TIFF)
- Simulates NIR and SWIR bands from RGB data
- Handles various image formats and sizes
- Robust error handling and validation

## Integration with VeriLeaf Frontend

The API is designed to integrate seamlessly with the VeriLeaf React frontend:

1. Frontend uploads before/after images to `/analyze` endpoint
2. API processes images and returns analysis results
3. Frontend displays impact score and detailed metrics
4. Results can be saved and shared as impact NFTs

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **Image Loading**: Check file paths and image formats
3. **Memory Issues**: Large images may require more RAM
4. **API Errors**: Check Flask server logs for detailed error messages

### Performance Tips

- Use images with reasonable resolution (1000-4000 pixels)
- Ensure good image quality and contrast
- Avoid heavily compressed images
- Use consistent lighting conditions for before/after images

## License

This project is part of the VeriLeaf ecosystem for environmental impact verification.
