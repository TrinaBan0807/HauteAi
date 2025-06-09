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
    'jacket': [
      'https://plus.unsplash.com/premium_photo-1675186049563-000f7ac02c44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFja2V0c3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1577660002965-04865592fc60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGphY2tldHN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGphY2tldHN8ZW58MHx8MHx8fDA%3D',
    
    ],
    'handbag': [
	'https://plus.unsplash.com/premium_photo-1723826753083-2309f7203ab1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D',
	  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D'
      
    ],
    'shoes': [
      'https://images.unsplash.com/photo-1528701800489-20e4fda1c5c2',
      'https://images.unsplash.com/photo-1600185365483-26d8c9e54a63',
      'https://images.unsplash.com/photo-1575537302964-96cd47fdd0f7',
      'https://images.unsplash.com/photo-1519741491158-2b2f59f2aab7'
    ]
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
    const type = this.ITEM_TYPE_MAPPING[query.toLowerCase()];
    if (!type) return [];
    return this.generateDiverseResults([type]);
  }

  static async searchByImageAndDescription(imageData: string, selectedArea: any, description: string): Promise<SearchResult[]> {
    const analysis = await this.analyzeImage(imageData, selectedArea);
    const itemType = analysis.detectedItems[0];
    if (!['jacket', 'handbag', 'shoes'].includes(itemType)) return [];
    return this.searchByQuery(itemType);
  }

  private static async generateDiverseResults(queryTerms: string[]): Promise<SearchResult[]> {
    const type = queryTerms[0];
    const resultCount = Math.floor(Math.random() * 4) + 6;
    const results: SearchResult[] = [];

    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleResult(queryTerms, i, type);
      results.push(result);
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static async generateSingleResult(queryTerms: string[], index: number, itemType: string): Promise<SearchResult> {
    const color = ['black', 'white', 'blue', 'red'][Math.floor(Math.random() * 4)];
    const style = ['casual', 'modern', 'classic'][Math.floor(Math.random() * 3)];
    const title = this.generateProductTitle(itemType, color, style);
    const price = this.generatePrice();
    const store = this.DEMO_STORES[Math.floor(Math.random() * this.DEMO_STORES.length)];
    const similarity = this.calculateSimilarity(queryTerms, title);
    const imageUrl = this.getItemSpecificImage(itemType, index);

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

  private static getItemSpecificImage(itemType: string, index: number): string {
    const images = this.ITEM_IMAGE_MAPPING[itemType as keyof typeof this.ITEM_IMAGE_MAPPING];
    if (images && images.length > 0) {
      return images[index % images.length];
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
