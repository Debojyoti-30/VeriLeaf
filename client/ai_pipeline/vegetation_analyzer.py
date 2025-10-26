"""
Vegetation Analysis Pipeline for VeriLeaf
Calculates NDVI, EVI, NDWI, SAVI, LAI, FVC and generates impact scores
"""

import numpy as np
import cv2
from PIL import Image
import json
import os
from typing import Dict, Tuple, List, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VegetationAnalyzer:
    """
    Advanced vegetation analysis using computer vision and remote sensing techniques
    """
    
    def __init__(self):
        self.results = {}
        
    def load_image(self, image_path: str) -> np.ndarray:
        """Load and preprocess image"""
        try:
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found: {image_path}")
            
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                # Try with PIL if OpenCV fails
                pil_image = Image.open(image_path)
                image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            
            # Convert to RGB for analysis
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            logger.info(f"Loaded image: {image_path}, shape: {image_rgb.shape}")
            return image_rgb
            
        except Exception as e:
            logger.error(f"Error loading image {image_path}: {str(e)}")
            raise
    
    def extract_bands(self, image: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Extract spectral bands from RGB image
        For satellite imagery, we simulate the bands based on RGB values
        """
        # Normalize to 0-1 range
        image_norm = image.astype(np.float32) / 255.0
        
        # Extract RGB bands
        red = image_norm[:, :, 0]
        green = image_norm[:, :, 1]
        blue = image_norm[:, :, 2]
        
        # Simulate NIR band (Near Infrared) - typically not available in RGB
        # Use a combination of red and green to estimate NIR
        nir = np.clip(0.8 * green + 0.2 * red, 0, 1)
        
        # Simulate SWIR band (Short Wave Infrared)
        swir = np.clip(0.6 * red + 0.4 * blue, 0, 1)
        
        return {
            'red': red,
            'green': green,
            'blue': blue,
            'nir': nir,
            'swir': swir
        }
    
    def calculate_ndvi(self, red: np.ndarray, nir: np.ndarray) -> np.ndarray:
        """
        Calculate Normalized Difference Vegetation Index (NDVI)
        NDVI = (NIR - Red) / (NIR + Red)
        Range: -1 to 1, higher values indicate more vegetation
        """
        # Avoid division by zero
        denominator = nir + red
        denominator = np.where(denominator == 0, 1e-10, denominator)
        
        ndvi = (nir - red) / denominator
        return np.clip(ndvi, -1, 1)
    
    def calculate_evi(self, red: np.ndarray, nir: np.ndarray, blue: np.ndarray) -> np.ndarray:
        """
        Calculate Enhanced Vegetation Index (EVI)
        EVI = 2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)
        Range: -1 to 1, better for dense vegetation
        """
        denominator = nir + 6 * red - 7.5 * blue + 1
        denominator = np.where(denominator == 0, 1e-10, denominator)
        
        evi = 2.5 * (nir - red) / denominator
        return np.clip(evi, -1, 1)
    
    def calculate_ndwi(self, green: np.ndarray, nir: np.ndarray) -> np.ndarray:
        """
        Calculate Normalized Difference Water Index (NDWI)
        NDWI = (Green - NIR) / (Green + NIR)
        Range: -1 to 1, higher values indicate more water content
        """
        denominator = green + nir
        denominator = np.where(denominator == 0, 1e-10, denominator)
        
        ndwi = (green - nir) / denominator
        return np.clip(ndwi, -1, 1)
    
    def calculate_savi(self, red: np.ndarray, nir: np.ndarray, l: float = 0.5) -> np.ndarray:
        """
        Calculate Soil Adjusted Vegetation Index (SAVI)
        SAVI = (NIR - Red) / (NIR + Red + L) * (1 + L)
        L is soil brightness correction factor (0.5 is commonly used)
        Range: -1 to 1, better for areas with exposed soil
        """
        denominator = nir + red + l
        denominator = np.where(denominator == 0, 1e-10, denominator)
        
        savi = (nir - red) / denominator * (1 + l)
        return np.clip(savi, -1, 1)
    
    def calculate_lai(self, ndvi: np.ndarray) -> np.ndarray:
        """
        Calculate Leaf Area Index (LAI) from NDVI
        LAI = -ln(0.69 - 0.59*NDVI) / 0.91
        Range: 0 to 8, higher values indicate more leaf area
        """
        # Avoid log of negative numbers
        argument = 0.69 - 0.59 * ndvi
        argument = np.where(argument <= 0, 1e-10, argument)
        
        lai = -np.log(argument) / 0.91
        return np.clip(lai, 0, 8)
    
    def calculate_fvc(self, ndvi: np.ndarray) -> np.ndarray:
        """
        Calculate Fractional Vegetation Cover (FVC) from NDVI
        FVC = (NDVI - NDVI_soil) / (NDVI_veg - NDVI_soil)
        Using typical values: NDVI_soil = 0.05, NDVI_veg = 0.95
        Range: 0 to 1, represents fraction of vegetation cover
        """
        ndvi_soil = 0.05
        ndvi_veg = 0.95
        
        fvc = (ndvi - ndvi_soil) / (ndvi_veg - ndvi_soil)
        return np.clip(fvc, 0, 1)
    
    def calculate_vegetation_metrics(self, image: np.ndarray) -> Dict[str, float]:
        """Calculate all vegetation metrics for an image"""
        bands = self.extract_bands(image)
        
        # Calculate indices
        ndvi = self.calculate_ndvi(bands['red'], bands['nir'])
        evi = self.calculate_evi(bands['red'], bands['nir'], bands['blue'])
        ndwi = self.calculate_ndwi(bands['green'], bands['nir'])
        savi = self.calculate_savi(bands['red'], bands['nir'])
        lai = self.calculate_lai(ndvi)
        fvc = self.calculate_fvc(ndvi)
        
        # Calculate statistics
        metrics = {
            'ndvi_mean': float(np.mean(ndvi)),
            'ndvi_std': float(np.std(ndvi)),
            'ndvi_max': float(np.max(ndvi)),
            'ndvi_min': float(np.min(ndvi)),
            
            'evi_mean': float(np.mean(evi)),
            'evi_std': float(np.std(evi)),
            'evi_max': float(np.max(evi)),
            'evi_min': float(np.min(evi)),
            
            'ndwi_mean': float(np.mean(ndwi)),
            'ndwi_std': float(np.std(ndwi)),
            'ndwi_max': float(np.max(ndwi)),
            'ndwi_min': float(np.min(ndwi)),
            
            'savi_mean': float(np.mean(savi)),
            'savi_std': float(np.std(savi)),
            'savi_max': float(np.max(savi)),
            'savi_min': float(np.min(savi)),
            
            'lai_mean': float(np.mean(lai)),
            'lai_std': float(np.std(lai)),
            'lai_max': float(np.max(lai)),
            'lai_min': float(np.min(lai)),
            
            'fvc_mean': float(np.mean(fvc)),
            'fvc_std': float(np.std(fvc)),
            'fvc_max': float(np.max(fvc)),
            'fvc_min': float(np.min(fvc)),
        }
        
        return metrics
    
    def calculate_impact_score(self, before_metrics: Dict[str, float], 
                             after_metrics: Dict[str, float]) -> Dict[str, float]:
        """
        Calculate environmental impact score based on vegetation changes
        Returns a score from 0-100
        """
        
        # Calculate percentage changes for key metrics
        ndvi_change = ((after_metrics['ndvi_mean'] - before_metrics['ndvi_mean']) / 
                      (abs(before_metrics['ndvi_mean']) + 1e-10)) * 100
        
        evi_change = ((after_metrics['evi_mean'] - before_metrics['evi_mean']) / 
                     (abs(before_metrics['evi_mean']) + 1e-10)) * 100
        
        fvc_change = ((after_metrics['fvc_mean'] - before_metrics['fvc_mean']) / 
                     (abs(before_metrics['fvc_mean']) + 1e-10)) * 100
        
        lai_change = ((after_metrics['lai_mean'] - before_metrics['lai_mean']) / 
                     (abs(before_metrics['lai_mean']) + 1e-10)) * 100
        
        # Weighted scoring system
        weights = {
            'ndvi': 0.35,  # Most important for vegetation health
            'evi': 0.25,   # Good for dense vegetation
            'fvc': 0.25,   # Important for coverage assessment
            'lai': 0.15    # Additional vegetation density measure
        }
        
        # Calculate weighted score
        # Positive changes (improvement) get positive scores
        # Negative changes (degradation) get negative scores
        weighted_score = (
            weights['ndvi'] * ndvi_change +
            weights['evi'] * evi_change +
            weights['fvc'] * fvc_change +
            weights['lai'] * lai_change
        )
        
        # Convert to 0-100 scale
        # Base score of 50 (neutral)
        # Add weighted changes (scaled to fit in remaining 50 points)
        impact_score = 50 + (weighted_score * 0.5)
        impact_score = np.clip(impact_score, 0, 100)
        
        # Calculate confidence based on consistency of changes
        changes = [ndvi_change, evi_change, fvc_change, lai_change]
        consistency = 1 - (np.std(changes) / (np.mean(np.abs(changes)) + 1e-10))
        confidence = np.clip(consistency * 100, 0, 100)
        
        # Determine impact category
        if impact_score >= 80:
            category = "Excellent"
        elif impact_score >= 65:
            category = "Good"
        elif impact_score >= 50:
            category = "Moderate"
        elif impact_score >= 35:
            category = "Poor"
        else:
            category = "Very Poor"
        
        return {
            'impact_score': float(impact_score),
            'confidence': float(confidence),
            'category': category,
            'ndvi_change_percent': float(ndvi_change),
            'evi_change_percent': float(evi_change),
            'fvc_change_percent': float(fvc_change),
            'lai_change_percent': float(lai_change),
            'weighted_score': float(weighted_score)
        }
    
    def analyze_images(self, before_path: str, after_path: str) -> Dict:
        """
        Complete analysis pipeline for before/after images
        """
        logger.info("Starting vegetation analysis...")
        
        try:
            # Load images
            before_image = self.load_image(before_path)
            after_image = self.load_image(after_path)
            
            # Calculate metrics for both images
            before_metrics = self.calculate_vegetation_metrics(before_image)
            after_metrics = self.calculate_vegetation_metrics(after_image)
            
            # Calculate impact score
            impact_analysis = self.calculate_impact_score(before_metrics, after_metrics)
            
            # Compile results
            results = {
                'timestamp': datetime.now().isoformat(),
                'before_image': before_path,
                'after_image': after_path,
                'before_metrics': before_metrics,
                'after_metrics': after_metrics,
                'impact_analysis': impact_analysis,
                'status': 'success'
            }
            
            logger.info(f"Analysis complete. Impact score: {impact_analysis['impact_score']:.1f}")
            return results
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return {
                'timestamp': datetime.now().isoformat(),
                'status': 'error',
                'error': str(e)
            }
    
    def save_results(self, results: Dict, output_path: str):
        """Save analysis results to JSON file"""
        try:
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
            logger.info(f"Results saved to: {output_path}")
        except Exception as e:
            logger.error(f"Failed to save results: {str(e)}")

def main():
    """Example usage of the VegetationAnalyzer"""
    analyzer = VegetationAnalyzer()
    
    # Example paths (update these to your actual image paths)
    before_path = "before.jpg"
    after_path = "after.jpg"
    
    if os.path.exists(before_path) and os.path.exists(after_path):
        results = analyzer.analyze_images(before_path, after_path)
        analyzer.save_results(results, "vegetation_analysis_results.json")
        
        # Print summary
        if results['status'] == 'success':
            impact = results['impact_analysis']
            print(f"\n=== VEGETATION ANALYSIS RESULTS ===")
            print(f"Impact Score: {impact['impact_score']:.1f}/100")
            print(f"Category: {impact['category']}")
            print(f"Confidence: {impact['confidence']:.1f}%")
            print(f"NDVI Change: {impact['ndvi_change_percent']:.1f}%")
            print(f"EVI Change: {impact['evi_change_percent']:.1f}%")
            print(f"FVC Change: {impact['fvc_change_percent']:.1f}%")
            print(f"LAI Change: {impact['lai_change_percent']:.1f}%")
    else:
        print("Please provide valid before and after image paths")

if __name__ == "__main__":
    main()
