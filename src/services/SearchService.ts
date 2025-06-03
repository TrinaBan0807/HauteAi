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

  private static readonly DEMO_BRANDS = [
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Levi\'s', 
    'Puma', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren'
  ];

  private static readonly FASHION_ITEMS = [
    'handbag', 'shoes', 'shirt', 'skirt', 'dress', 'jacket', 'pants', 
    'sneakers', 'boots', 'blouse', 'sweater', 'coat', 'jeans', 't-shirt',
    'sandals', 'heels', 'clutch', 'backpack', 'scarf', 'belt'
  ];

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    console.log('Analyzing image for fashion items...');
    
    // Simulate image processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI image analysis with diverse items
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

  static async searchByQuery(query: string): Promise<SearchResult[]> {
    console.log('Searching for items with query:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryTerms = this.extractQueryTerms(query);
    const results = await this.generateDynamicResults(queryTerms);
    
    console.log('Search results:', results);
    return results;
  }

  static async searchByImageAndDescription(
    imageData: string, 
    selectedArea: any, 
    description: string
  ): Promise<SearchResult[]> {
    console.log('Starting image + description search...');
    
    // Analyze the image
    const imageAnalysis = await this.analyzeImage(imageData, selectedArea);
    
    // Combine image analysis with description
    const combinedQuery = this.combineImageAndText(imageAnalysis, description);
    
    // Search based on combined analysis
    return await this.searchByQuery(combinedQuery);
  }

  private static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige'];
    return this.getRandomItems(colors, 2, 4);
  }

  private static detectDiverseFashionItems(): string[] {
    return this.getRandomItems(this.FASHION_ITEMS, 1, 3);
  }

  private static analyzeStyle(): string[] {
    const styles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant'];
    return this.getRandomItems(styles, 1, 2);
  }

  private static detectPatterns(): string[] {
    const patterns = ['solid', 'striped', 'floral', 'geometric', 'polka dot', 'plaid', 'abstract'];
    return this.getRandomItems(patterns, 0, 2);
  }

  private static detectMaterials(): string[] {
    const materials = ['cotton', 'denim', 'leather', 'silk', 'wool', 'polyester', 'linen', 'cashmere'];
    return this.getRandomItems(materials, 0, 2);
  }

  private static extractQueryTerms(query: string): string[] {
    return query.toLowerCase()
      .split(/[,\s]+/)
      .filter(term => term.length > 2 && !['the', 'and', 'for', 'with', 'under'].includes(term));
  }

  private static combineImageAndText(imageAnalysis: ImageAnalysis, description: string): string {
    const descriptionTerms = this.extractQueryTerms(description);
    const imageTerms = [
      ...imageAnalysis.detectedItems,
      ...imageAnalysis.dominantColors,
      ...imageAnalysis.style,
      ...imageAnalysis.patterns,
      ...imageAnalysis.material
    ].filter(Boolean);

    return [...new Set([...descriptionTerms, ...imageTerms])].join(' ');
  }

  private static async generateDynamicResults(queryTerms: string[]): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 6) + 4; // 4-9 results
    const results: SearchResult[] = [];

    // Ensure we get diverse items by forcing different categories
    const diverseItems = this.ensureDiverseItems(queryTerms, resultCount);

    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleResult(queryTerms, i, diverseItems[i]);
      results.push(result);
    }

    // Sort by similarity (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static ensureDiverseItems(queryTerms: string[], count: number): string[] {
    const items = [];
    const categories = ['handbag', 'shoes', 'shirt', 'skirt', 'dress'];
    
    // First, add one item from each main category
    for (let i = 0; i < Math.min(count, categories.length); i++) {
      items.push(categories[i]);
    }
    
    // Fill remaining slots with diverse items
    while (items.length < count) {
      const randomItem = this.FASHION_ITEMS[Math.floor(Math.random() * this.FASHION_ITEMS.length)];
      items.push(randomItem);
    }
    
    return items;
  }

  private static async generateSingleResult(queryTerms: string[], index: number, forceItemType?: string): Promise<SearchResult> {
    const itemTypes = this.getRelevantItemTypes(queryTerms);
    const colors = this.getRelevantColors(queryTerms);
    const styles = this.getRelevantStyles(queryTerms);
    
    const itemType = forceItemType || itemTypes[Math.floor(Math.random() * itemTypes.length)] || 'item';
    const color = colors[Math.floor(Math.random() * colors.length)] || '';
    const style = styles[Math.floor(Math.random() * styles.length)] || '';
    
    const title = this.generateProductTitle(itemType, color, style);
    const price = this.generatePrice(itemType);
    const store = this.DEMO_STORES[Math.floor(Math.random() * this.DEMO_STORES.length)];
    const similarity = this.calculateSimilarity(queryTerms, title);
    const imageUrl = await this.getProductImage(itemType, index);

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

  private static getRelevantItemTypes(queryTerms: string[]): string[] {
    const allItems = ['t-shirt', 'dress', 'jeans', 'jacket', 'shoes', 'bag', 'sweater', 'skirt', 'shorts', 'boots', 'sneakers', 'blazer'];
    const relevant = allItems.filter(item => 
      queryTerms.some(term => item.includes(term) || term.includes(item.split('-')[0]))
    );
    return relevant.length > 0 ? relevant : ['clothing'];
  }

  private static getRelevantColors(queryTerms: string[]): string[] {
    const allColors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige'];
    const relevant = allColors.filter(color => queryTerms.includes(color));
    return relevant.length > 0 ? relevant : [''];
  }

  private static getRelevantStyles(queryTerms: string[]): string[] {
    const allStyles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant'];
    const relevant = allStyles.filter(style => queryTerms.includes(style));
    return relevant.length > 0 ? relevant : [''];
  }

  private static generateProductTitle(itemType: string, color: string, style: string): string {
    const adjectives = ['Premium', 'Classic', 'Modern', 'Vintage', 'Designer', 'Comfortable', 'Stylish', 'Trendy'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const parts = [adjective, color, style, itemType].filter(Boolean);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  private static generatePrice(itemType: string): string {
    const basePrices: { [key: string]: [number, number] } = {
      'handbag': [80, 350],
      'shoes': [50, 200],
      'sneakers': [60, 180],
      'heels': [70, 250],
      'boots': [90, 300],
      'dress': [30, 150],
      'jacket': [60, 300],
      'shirt': [25, 80],
      'skirt': [20, 90],
      'jeans': [40, 120],
      't-shirt': [15, 60],
      'sweater': [35, 100],
      'default': [20, 100]
    };

    const [min, max] = basePrices[itemType] || basePrices.default;
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${price}.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }

  private static calculateSimilarity(queryTerms: string[], title: string): number {
    const titleLower = title.toLowerCase();
    const matches = queryTerms.filter(term => titleLower.includes(term)).length;
    const similarity = Math.min(95, 60 + (matches * 10) + Math.floor(Math.random() * 15));
    return similarity;
  }

  private static async getProductImage(itemType: string, index: number): Promise<string> {
    const imageQueries: { [key: string]: string } = {
      'handbag': 'handbag fashion accessory',
      'shoes': 'fashion shoes footwear',
      'sneakers': 'white sneakers shoes',
      'heels': 'high heels women shoes',
      'boots': 'boots footwear leather',
      'dress': 'fashion dress women clothing',
      'jacket': 'jacket outerwear fashion',
      'shirt': 'shirt fashion clothing',
      'skirt': 'skirt women fashion',
      'jeans': 'jeans denim pants',
      't-shirt': 'tshirt casual wear',
      'sweater': 'sweater knitwear',
      'default': 'fashion clothing'
    };

    const query = imageQueries[itemType] || imageQueries.default;
    const imageId = 400 + (index * 50);
    
    // Use Unsplash API with specific search terms for better variety
    return `https://images.unsplash.com/photo-1${500000000000 + index}?w=${imageId}&h=${imageId}&fit=crop&q=80`;
  }

  private static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
