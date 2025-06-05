
import { SearchResult, ImageAnalysis } from './types/SearchTypes';
import { DEMO_STORES } from './constants/FashionConstants';
import { SearchUtils } from './utils/SearchUtils';
import { ImageAnalysisUtils } from './utils/ImageAnalysisUtils';

export class SearchService {
  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    return ImageAnalysisUtils.analyzeImage(imageData, selectedArea);
  }

  static async searchByQuery(query: string): Promise<SearchResult[]> {
    console.log('Searching for items with query:', query);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryTerms = SearchUtils.extractQueryTerms(query);
    const results = await this.generateDiverseResults(queryTerms);
    
    console.log('Search results:', results);
    return results;
  }

  static async searchByImageAndDescription(
    imageData: string, 
    selectedArea: any, 
    description: string
  ): Promise<SearchResult[]> {
    console.log('Starting image + description search...');
    
    const imageAnalysis = await this.analyzeImage(imageData, selectedArea);
    const combinedQuery = this.combineImageAndText(imageAnalysis, description);
    
    return await this.searchByQuery(combinedQuery);
  }

  private static combineImageAndText(imageAnalysis: ImageAnalysis, description: string): string {
    const descriptionTerms = SearchUtils.extractQueryTerms(description);
    const imageTerms = [
      ...imageAnalysis.detectedItems,
      ...imageAnalysis.dominantColors,
      ...imageAnalysis.style,
      ...imageAnalysis.patterns,
      ...imageAnalysis.material
    ].filter(Boolean);

    return [...new Set([...descriptionTerms, ...imageTerms])].join(' ');
  }

  private static async generateDiverseResults(queryTerms: string[]): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 4) + 6;
    const results: SearchResult[] = [];

    const relevantItemTypes = SearchUtils.extractRelevantItemTypes(queryTerms);
    
    for (let i = 0; i < resultCount; i++) {
      const itemType = relevantItemTypes[i % relevantItemTypes.length] || 'shirt';
      const result = await this.generateSingleResult(queryTerms, i, itemType);
      results.push(result);
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static async generateSingleResult(queryTerms: string[], index: number, itemType: string): Promise<SearchResult> {
    const colors = SearchUtils.getRelevantColors(queryTerms);
    const styles = SearchUtils.getRelevantStyles(queryTerms);
    
    const color = colors[Math.floor(Math.random() * colors.length)] || '';
    const style = styles[Math.floor(Math.random() * styles.length)] || '';
    
    const title = SearchUtils.generateProductTitle(itemType, color, style);
    const price = SearchUtils.generatePrice(itemType);
    const store = DEMO_STORES[Math.floor(Math.random() * DEMO_STORES.length)];
    const similarity = SearchUtils.calculateSimilarity(queryTerms, title);
    const imageUrl = SearchUtils.getItemSpecificImage(itemType, index);

    return {
      id: `dynamic_${Date.now()}_${index}`,
      title,
      price,
      store,
      imageUrl,
      link: `#product_${index}`,
      similarity
    };
  }
}
