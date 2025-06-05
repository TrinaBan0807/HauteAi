
import { ImageAnalysis } from '../types/SearchTypes';
import { SearchUtils } from './SearchUtils';

export class ImageAnalysisUtils {
  static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral', 'turquoise'];
    return SearchUtils.getRandomItems(colors, 2, 4);
  }

  static detectDiverseFashionItems(): string[] {
    const categories = {
      tops: ['hawaiian shirt', 't-shirt', 'shirt', 'sweater'],
      bottoms: ['skirt', 'jeans', 'pants'],
      accessories: ['handbag', 'hat', 'scarf', 'belt'],
      footwear: ['shoes', 'sneakers', 'boots'],
      outerwear: ['jacket', 'coat', 'blazer']
    };
    
    const selectedItems = [];
    const categoryKeys = Object.keys(categories);
    
    for (let i = 0; i < Math.min(3, categoryKeys.length); i++) {
      const category = categories[categoryKeys[i]];
      const item = category[Math.floor(Math.random() * category.length)];
      selectedItems.push(item);
    }
    
    return selectedItems;
  }

  static analyzeStyle(): string[] {
    const styles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant', 'tropical', 'summer'];
    return SearchUtils.getRandomItems(styles, 1, 2);
  }

  static detectPatterns(): string[] {
    const patterns = ['solid', 'striped', 'floral', 'geometric', 'polka dot', 'plaid', 'abstract', 'tropical', 'hawaiian'];
    return SearchUtils.getRandomItems(patterns, 0, 2);
  }

  static detectMaterials(): string[] {
    const materials = ['cotton', 'denim', 'leather', 'silk', 'wool', 'polyester', 'linen', 'cashmere', 'canvas'];
    return SearchUtils.getRandomItems(materials, 0, 2);
  }

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    console.log('Analyzing image for fashion items...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis: ImageAnalysis = {
      dominantColors: this.extractDominantColors(),
      detectedItems: this.detectDiverseFashionItems(),
      style: this.analyzeStyle(),
      patterns: this.detectPatterns(),
      material: this.detectMaterials()
    };
    
    console.log('Image analysis complete:', analysis);
    return analysis;
  }
}
