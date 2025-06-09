interface SearchResult {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  link: string;
  similarity: number;
}

interface ImageAnalysis {
  dominantColors: string[];
  detectedItems: string[];
  style: string[];
  patterns: string[];
  material: string[];
}

export class SearchService {
  private static readonly DEMO_STORES = [
    'Fashion Store', 'Style Hub', 'Eco Fashion', 'Dress Boutique',
    'Fashion Forward', 'Shoe Palace', 'Luxury Brands', 'Everyday Wear',
    'Trendy Closet', 'Modern Wear', 'Urban Vogue', 'Chic Finds'
  ];

  private static readonly ITEM_IMAGE_MAPPING = {
    'jacket': {
	'blue':'https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxhY2slMjBkZW5pbSUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'black': 'https://plus.unsplash.com/premium_photo-1671030274122-b6ac34f87b8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2slMjBkZW5pbSUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'red': 'https://images.unsplash.com/photo-1578948856697-db91d246b7b1'
    },
    'handbag': {
      'red': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D,
      'black': 'https://images.unsplash.com/photo-1705909237050-7a7625b47fac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D',
	  'cream':'https://images.unsplash.com/photo-1705909237050-7a7625b47fac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D'
    },
    'shoes': {
      'black': 'https://images.unsplash.com/photo-1725387023639-28e9a42a83b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxhY2slMjBib290c3xlbnwwfHwwfHx8MA%3D%3D',
      'black': 'https://plus.unsplash.com/premium_photo-1729788891808-603a418d37cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJsYWNrJTIwYm9vdHN8ZW58MHx8MHx8fDA%3D',
	  'white':'https://images.unsplash.com/photo-1612905468542-585ca599afbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2hpdGUlMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D'
    }
  };

  private static readonly ITEM_TYPE_MAPPING = {
    'jacket': 'jacket',
    'coat': 'jacket',
    'blazer': 'jacket',
    'handbag': 'handbag',
    'bag': 'handbag',
    'purse': 'handbag',
    'shoes': 'shoes',
    'sneakers': 'shoes',
    'boots': 'shoes'
  };

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const allTypes = ['jacket', 'handbag', 'shoes'];
    const detected = [allTypes[Math.floor(Math.random() * allTypes.length)]];
    return {
      dominantColors: this.getRandomItems(['black', 'white', 'blue', 'red'], 2, 4),
      detectedItems: detected,
      style: this.getRandomItems(['casual', 'modern', 'classic'], 1, 2),
      patterns: this.getRandomItems(['solid', 'striped'], 0, 2),
      material: this.getRandomItems(['leather', 'wool', 'denim'], 0, 2),
    };
  }

  static async searchByQuery(query: string): Promise<SearchResult[]> {
    const parts = query.toLowerCase().split(' ');
    const color = parts.find(p => ['black', 'red', 'white', 'blue'].includes(p));
    const type = parts.map(p => this.ITEM_TYPE_MAPPING[p]).find(p => p);
    if (!['jacket', 'handbag', 'shoes'].includes(type)) return [];
    return this.generateDiverseResults([type], color);
  }

  static async searchByImageAndDescription(imageData: string, selectedArea: any, description: string): Promise<SearchResult[]> {
    const analysis = await this.analyzeImage(imageData, selectedArea);
    const itemType = analysis.detectedItems.find(item => ['jacket', 'handbag', 'shoes'].includes(item));
    if (!itemType) return [];

    const parts = description.toLowerCase().split(' ');
    const color = parts.find(p => ['black', 'red', 'white', 'blue'].includes(p));

    return this.generateDiverseResults([itemType], color);
  }

  private static async generateDiverseResults(queryTerms: string[], colorHint?: string): Promise<SearchResult[]> {
    const type = queryTerms[0];
    const resultCount = Math.floor(Math.random() * 4) + 6;
    const results: SearchResult[] = [];

    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleResult(queryTerms, i, type, colorHint);
      results.push(result);
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static async generateSingleResult(queryTerms: string[], index: number, itemType: string, colorHint?: string): Promise<SearchResult> {
    const colors = ['black', 'white', 'blue', 'red'];
    const color = colorHint || colors[Math.floor(Math.random() * colors.length)];
    const style = ['casual', 'modern', 'classic'][Math.floor(Math.random() * 3)];
    const title = this.generateProductTitle(itemType, color, style);
    const price = this.generatePrice();
    const store = this.DEMO_STORES[Math.floor(Math.random() * this.DEMO_STORES.length)];
    const similarity = this.calculateSimilarity(queryTerms, title);
    const imageUrl = this.getItemSpecificImage(itemType, color);

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

  private static getItemSpecificImage(itemType: string, color: string): string {
    const images = this.ITEM_IMAGE_MAPPING[itemType as keyof typeof this.ITEM_IMAGE_MAPPING];
    if (images && color in images) {
      return images[color as keyof typeof images];
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80';
  }

  private static generateProductTitle(itemType: string, color: string, style: string): string {
    const adjectives = ['Premium', 'Classic', 'Modern', 'Designer'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective} ${color} ${style} ${itemType}`;
  }

  private static generatePrice(): string {
    const [min, max] = [50, 300];
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${price}.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }

  private static calculateSimilarity(queryTerms: string[], title: string): number {
    const titleLower = title.toLowerCase();
    const matches = queryTerms.filter(term => titleLower.includes(term)).length;
    return Math.min(95, 65 + (matches * 8) + Math.floor(Math.random() * 12));
  }

  private static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
  }
}
