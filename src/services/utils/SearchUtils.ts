
import { ITEM_TYPE_MAPPING, ITEM_IMAGE_MAPPING, BASE_PRICES } from '../constants/FashionConstants';
import { SearchResult } from '../types/SearchTypes';

export class SearchUtils {
  static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static extractQueryTerms(query: string): string[] {
    return query.toLowerCase()
      .split(/[,\s]+/)
      .filter(term => term.length > 2 && !['the', 'and', 'for', 'with', 'under'].includes(term));
  }

  static extractRelevantItemTypes(queryTerms: string[]): string[] {
    const foundTypes = [];
    
    for (const term of queryTerms) {
      if (ITEM_TYPE_MAPPING[term]) {
        const mappedType = ITEM_TYPE_MAPPING[term];
        if (!foundTypes.includes(mappedType)) {
          foundTypes.push(mappedType);
        }
      }
      
      for (const [key, value] of Object.entries(ITEM_TYPE_MAPPING)) {
        if (term.includes(key) || key.includes(term)) {
          if (!foundTypes.includes(value)) {
            foundTypes.push(value);
          }
        }
      }
    }
    
    return foundTypes.length > 0 ? foundTypes : ['shirt', 't-shirt', 'dress'];
  }

  static getItemSpecificImage(itemType: string, index: number): string {
    const images = ITEM_IMAGE_MAPPING[itemType as keyof typeof ITEM_IMAGE_MAPPING];
    if (images && images.length > 0) {
      return images[index % images.length];
    }
    
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80';
  }

  static getRelevantColors(queryTerms: string[]): string[] {
    const allColors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral'];
    const relevant = allColors.filter(color => queryTerms.includes(color));
    return relevant.length > 0 ? relevant : ['black', 'white', 'blue', 'red'];
  }

  static getRelevantStyles(queryTerms: string[]): string[] {
    const allStyles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant', 'tropical'];
    const relevant = allStyles.filter(style => queryTerms.includes(style));
    return relevant.length > 0 ? relevant : ['casual', 'modern', 'classic'];
  }

  static generateProductTitle(itemType: string, color: string, style: string): string {
    const adjectives = ['Premium', 'Classic', 'Modern', 'Vintage', 'Designer', 'Comfortable', 'Stylish', 'Trendy', 'Chic', 'Elegant'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const parts = [adjective, color, style, itemType].filter(Boolean);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  static generatePrice(itemType: string): string {
    const [min, max] = BASE_PRICES[itemType] || BASE_PRICES.default;
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${price}.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }

  static calculateSimilarity(queryTerms: string[], title: string): number {
    const titleLower = title.toLowerCase();
    const matches = queryTerms.filter(term => titleLower.includes(term)).length;
    const similarity = Math.min(95, 65 + (matches * 8) + Math.floor(Math.random() * 12));
    return similarity;
  }
}
