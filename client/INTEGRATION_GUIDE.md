# VeriLeaf AI Integration Guide

This guide explains how to set up and use the AI-powered vegetation analysis pipeline integrated with the VeriLeaf frontend.

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
cd VeriLeaf/client
pip install -r ai_pipeline/requirements.txt
```

### 2. Start the AI Server

**Windows:**
```bash
start_ai_server.bat
```

**Linux/Mac:**
```bash
python3 start_ai_server.py
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and will automatically connect to the AI server at `http://localhost:5000`.

## 🔧 Features

### AI-Powered Vegetation Analysis

The system calculates the following vegetation indices:

- **NDVI** (Normalized Difference Vegetation Index) - Primary vegetation health indicator
- **EVI** (Enhanced Vegetation Index) - Better for dense vegetation areas
- **NDWI** (Normalized Difference Water Index) - Water content in vegetation
- **SAVI** (Soil Adjusted Vegetation Index) - Adjusted for soil background
- **LAI** (Leaf Area Index) - Total leaf area per unit ground area
- **FVC** (Fractional Vegetation Cover) - Fraction of ground covered by vegetation

### Impact Scoring

The system generates an impact score from 0-100 based on weighted vegetation changes:

- **80-100**: Excellent environmental impact
- **65-79**: Good environmental impact
- **50-64**: Moderate environmental impact
- **35-49**: Poor environmental impact
- **0-34**: Very poor environmental impact

### Frontend Integration

The Verify.tsx component now includes:

- **Image Upload**: Drag-and-drop interface for before/after images
- **Real-time Analysis**: Live connection to Python AI pipeline
- **Detailed Results**: Comprehensive metrics and visualizations
- **Error Handling**: User-friendly error messages and validation
- **Sample Data**: Built-in sample images for testing

## 📊 How It Works

### 1. Image Processing

1. User uploads before and after images
2. Images are sent to the Python AI pipeline
3. System extracts spectral bands (RGB → simulated NIR/SWIR)
4. Vegetation indices are calculated for both images

### 2. Analysis Pipeline

1. **Band Extraction**: RGB images are processed to simulate satellite bands
2. **Index Calculation**: All vegetation indices are computed
3. **Change Detection**: Before/after comparison with percentage changes
4. **Impact Scoring**: Weighted algorithm generates 0-100 score
5. **Confidence Assessment**: Statistical analysis of result reliability

### 3. Results Display

1. **Main Metrics**: Impact score, category, and confidence
2. **Detailed Breakdown**: Individual index changes
3. **Before/After Comparison**: Side-by-side metric comparison
4. **CO2 Estimation**: Environmental impact quantification

## 🛠️ API Endpoints

The Python server provides these endpoints:

- `GET /health` - Health check
- `POST /analyze` - Upload and analyze images (multipart/form-data)
- `POST /analyze/paths` - Analyze images by file paths (JSON)
- `GET /results/<session_id>` - Get analysis results
- `GET /metrics` - Get available metrics information

## 🔍 Usage Examples

### Frontend Integration

```typescript
import { vegetationAnalysisService } from '@/services/vegetationAnalysis';

// Analyze uploaded images
const results = await vegetationAnalysisService.analyzeVegetation(beforeFile, afterFile);

// Analyze by file paths
const results = await vegetationAnalysisService.analyzeVegetationByPaths({
  before_path: "before.jpg",
  after_path: "after.jpg"
});

// Get impact score
const impactScore = results.impact_analysis.impact_score;
const category = results.impact_analysis.category;
```

### Direct Python Usage

```python
from ai_pipeline.vegetation_analyzer import VegetationAnalyzer

analyzer = VegetationAnalyzer()
results = analyzer.analyze_images("before.jpg", "after.jpg")

print(f"Impact Score: {results['impact_analysis']['impact_score']}")
print(f"Category: {results['impact_analysis']['category']}")
```

## 🧪 Testing

### Test with Sample Images

1. Click "Use Sample Images" in the Verify page
2. The system will analyze the built-in before.jpg and after.jpg files
3. Results should show significant vegetation improvement

### Test with Custom Images

1. Upload your own before/after images
2. Ensure images are in supported formats (PNG, JPG, JPEG, TIFF)
3. Wait for analysis to complete
4. Review detailed results and metrics

## 🐛 Troubleshooting

### Common Issues

1. **"Analysis failed" Error**
   - Check if Python server is running on port 5000
   - Verify all dependencies are installed
   - Check image file formats and sizes

2. **"Connection refused" Error**
   - Start the AI server: `python start_ai_server.py`
   - Check if port 5000 is available
   - Verify firewall settings

3. **Low Confidence Scores**
   - Use higher quality images
   - Ensure good contrast and lighting
   - Avoid heavily compressed images

4. **Import Errors**
   - Install missing Python packages: `pip install -r ai_pipeline/requirements.txt`
   - Check Python version (3.8+ recommended)

### Performance Tips

- Use images with reasonable resolution (1000-4000 pixels)
- Ensure consistent lighting conditions
- Avoid heavily compressed images
- Use images with good contrast and detail

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_AI_API_URL=http://localhost:5000
```

### Custom Weights

Modify the impact scoring weights in `ai_pipeline/vegetation_analyzer.py`:

```python
weights = {
    'ndvi': 0.35,  # Most important for vegetation health
    'evi': 0.25,   # Good for dense vegetation
    'fvc': 0.25,   # Important for coverage assessment
    'lai': 0.15    # Additional vegetation density measure
}
```

## 📈 Future Enhancements

- **Real Satellite Data**: Integration with Sentinel-2 API
- **Machine Learning**: Advanced change detection algorithms
- **Batch Processing**: Multiple image analysis
- **Export Features**: PDF reports and data export
- **Mobile Support**: Responsive design improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the VeriLeaf ecosystem for environmental impact verification.
