"""
Standalone script to run vegetation analysis on before/after images
Usage: python run_analysis.py before.jpg after.jpg
"""

import sys
import os
import json
from vegetation_analyzer import VegetationAnalyzer

def main():
    if len(sys.argv) != 3:
        print("Usage: python run_analysis.py <before_image> <after_image>")
        print("Example: python run_analysis.py before.jpg after.jpg")
        sys.exit(1)
    
    before_path = sys.argv[1]
    after_path = sys.argv[2]
    
    # Check if files exist
    if not os.path.exists(before_path):
        print(f"Error: Before image not found: {before_path}")
        sys.exit(1)
    
    if not os.path.exists(after_path):
        print(f"Error: After image not found: {after_path}")
        sys.exit(1)
    
    print("VeriLeaf Vegetation Analysis")
    print("=" * 50)
    print(f"Before image: {before_path}")
    print(f"After image: {after_path}")
    print()
    
    # Initialize analyzer
    analyzer = VegetationAnalyzer()
    
    # Run analysis
    print("Analyzing vegetation changes...")
    results = analyzer.analyze_images(before_path, after_path)
    
    if results['status'] == 'success':
        # Display results
        impact = results['impact_analysis']
        before_metrics = results['before_metrics']
        after_metrics = results['after_metrics']
        
        print("\nANALYSIS RESULTS")
        print("=" * 50)
        
        # Impact Score
        print(f"Impact Score: {impact['impact_score']:.1f}/100")
        print(f"Category: {impact['category']}")
        print(f"Confidence: {impact['confidence']:.1f}%")
        print()
        
        # Changes
        print("VEGETATION CHANGES")
        print("-" * 30)
        print(f"NDVI Change: {impact['ndvi_change_percent']:+.1f}%")
        print(f"EVI Change:  {impact['evi_change_percent']:+.1f}%")
        print(f"FVC Change:  {impact['fvc_change_percent']:+.1f}%")
        print(f"LAI Change:  {impact['lai_change_percent']:+.1f}%")
        print()
        
        # Before/After Comparison
        print("BEFORE vs AFTER COMPARISON")
        print("-" * 40)
        print(f"{'Metric':<15} {'Before':<10} {'After':<10} {'Change':<10}")
        print("-" * 40)
        
        metrics = ['ndvi', 'evi', 'ndwi', 'savi', 'lai', 'fvc']
        for metric in metrics:
            before_val = before_metrics[f'{metric}_mean']
            after_val = after_metrics[f'{metric}_mean']
            change = after_val - before_val
            print(f"{metric.upper():<15} {before_val:<10.3f} {after_val:<10.3f} {change:+.3f}")
        
        print()
        
        # Save results
        output_file = "vegetation_analysis_results.json"
        analyzer.save_results(results, output_file)
        print(f"Results saved to: {output_file}")
        
        # Interpretation
        print("\nINTERPRETATION")
        print("-" * 20)
        if impact['impact_score'] >= 80:
            print("Excellent environmental impact! Significant vegetation improvement detected.")
        elif impact['impact_score'] >= 65:
            print("Good environmental impact. Positive vegetation changes observed.")
        elif impact['impact_score'] >= 50:
            print("Moderate environmental impact. Some vegetation changes detected.")
        elif impact['impact_score'] >= 35:
            print("Poor environmental impact. Limited or negative vegetation changes.")
        else:
            print("Very poor environmental impact. Significant vegetation degradation detected.")
        
        print(f"\nConfidence level: {impact['confidence']:.1f}%")
        if impact['confidence'] >= 80:
            print("High confidence in results.")
        elif impact['confidence'] >= 60:
            print("Moderate confidence in results.")
        else:
            print("Low confidence in results. Consider using higher quality images.")
        
    else:
        print(f"Analysis failed: {results.get('error', 'Unknown error')}")
        sys.exit(1)

if __name__ == "__main__":
    main()
