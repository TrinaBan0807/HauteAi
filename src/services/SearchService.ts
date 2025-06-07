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
    'Fashion Forward', 'Shoe Palace', 'Athletic Gear', 'Luxury Brands', 
    'Everyday Wear', 'Trendy Closet', 'Vintage Finds', 'Modern Wear'
  ];

  private static readonly ITEM_IMAGE_MAPPING = {
    'jacket': [
      'https://images.unsplash.com/photo-1519758340474-40fa8cba6584?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww'
    ]
  };

  private static readonly ITEM_TYPE_MAPPING = {
    'sweater': 'jacket',
    'jacket': 'jacket',
    'blazer': 'jacket',
    'coat': 'jacket'
  };

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      dominantColors: this.extractDominantColors(),
      detectedItems: ['jacket'],
      style: this.analyzeStyle(),
      patterns: this.detectPatterns(),
      material: this.detectMaterials()
    };
  }

  static async searchByQuery(query: string): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = await this.generateDiverseResults(['jacket']);
    return results;
  }

  static async searchByImageAndDescription(imageData: string, selectedArea: any, description: string): Promise<SearchResult[]> {
    const imageAnalysis = await this.analyzeImage(imageData, selectedArea);
    return await this.searchByQuery('jacket');
  }

  private static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red'];
    return this.getRandomItems(colors, 2, 4);
  }

  private static analyzeStyle(): string[] {
    const styles = ['casual', 'modern', 'classic'];
    return this.getRandomItems(styles, 1, 2);
  }

  private static detectPatterns(): string[] {
    const patterns = ['solid', 'striped'];
    return this.getRandomItems(patterns, 0, 2);
  }

  private static detectMaterials(): string[] {
    const materials = ['leather', 'wool', 'denim'];
    return this.getRandomItems(materials, 0, 2);
  }

  private static async generateDiverseResults(queryTerms: string[]): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 4) + 6;
    const results: SearchResult[] = [];

    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleResult(queryTerms, i, 'jacket');
      results.push(result);
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static async generateSingleResult(queryTerms: string[], index: number, itemType: string): Promise<SearchResult> {
    const color = ['black', 'white', 'blue', 'red'][Math.floor(Math.random() * 4)];
    const style = ['casual', 'modern', 'classic'][Math.floor(Math.random() * 3)];
    const title = this.generateProductTitle(itemType, color, style);
    const price = this.generatePrice(itemType);
    const store = this.DEMO_STORES[Math.floor(Math.random() * this.DEMO_STORES.length)];
    const similarity = this.calculateSimilarity(['jacket'], title);
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
    return `${adjective} ${color} ${style} ${itemType}`.trim();
  }

  private static generatePrice(itemType: string): string {
    const [min, max] = [60, 300];
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
