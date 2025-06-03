
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

  private static readonly FASHION_ITEMS = [
    'hawaiian shirt', 'hat', 'skirt', 'handbag', 'shoes', 'dress', 'jacket', 'pants', 
    'sneakers', 'boots', 'blouse', 'sweater', 'coat', 'jeans', 't-shirt',
    'sandals', 'heels', 'clutch', 'backpack', 'scarf', 'belt', 'cap', 'fedora',
    'maxi dress', 'mini skirt', 'leather jacket', 'denim jacket', 'cargo pants'
  ];

  private static readonly UNSPLASH_KEYWORDS = {
    'hawaiian shirt': 'hawaiian-shirt-tropical-pattern',
    'hat': 'fashion-hat-style',
    'skirt': 'fashion-skirt-women',
    'handbag': 'leather-handbag-fashion',
    'shoes': 'fashion-shoes-footwear',
    'dress': 'fashion-dress-elegant',
    'jacket': 'fashion-jacket-outerwear',
    'pants': 'fashion-pants-trousers',
    'sneakers': 'sneakers-shoes-fashion',
    'boots': 'boots-leather-fashion',
    'blouse': 'blouse-fashion-women',
    'sweater': 'sweater-knitwear-fashion',
    'coat': 'coat-fashion-outerwear',
    'jeans': 'jeans-denim-fashion',
    't-shirt': 'tshirt-casual-fashion',
    'sandals': 'sandals-summer-shoes',
    'heels': 'high-heels-shoes',
    'clutch': 'clutch-bag-evening',
    'backpack': 'backpack-fashion-bag',
    'scarf': 'scarf-fashion-accessory',
    'belt': 'belt-leather-accessory',
    'cap': 'cap-hat-fashion',
    'fedora': 'fedora-hat-style',
    'maxi dress': 'maxi-dress-long',
    'mini skirt': 'mini-skirt-fashion',
    'leather jacket': 'leather-jacket-black',
    'denim jacket': 'denim-jacket-blue',
    'cargo pants': 'cargo-pants-utility'
  };

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
    
    // Analyze the image
    const imageAnalysis = await this.analyzeImage(imageData, selectedArea);
    
    // Combine image analysis with description
    const combinedQuery = this.combineImageAndText(imageAnalysis, description);
    
    // Search based on combined analysis
    return await this.searchByQuery(combinedQuery);
  }

  private static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral', 'turquoise'];
    return this.getRandomItems(colors, 2, 4);
  }

  private static detectDiverseFashionItems(): string[] {
    // Ensure we get diverse items by selecting from different categories
    const categories = {
      tops: ['hawaiian shirt', 't-shirt', 'blouse', 'sweater'],
      bottoms: ['skirt', 'pants', 'jeans', 'mini skirt'],
      accessories: ['handbag', 'hat', 'scarf', 'belt', 'clutch'],
      footwear: ['shoes', 'sneakers', 'boots', 'heels', 'sandals'],
      outerwear: ['jacket', 'coat', 'leather jacket', 'denim jacket']
    };
    
    const selectedItems = [];
    const categoryKeys = Object.keys(categories);
    
    // Pick at least one item from each category
    for (let i = 0; i < Math.min(3, categoryKeys.length); i++) {
      const category = categories[categoryKeys[i]];
      const item = category[Math.floor(Math.random() * category.length)];
      selectedItems.push(item);
    }
    
    return selectedItems;
  }

  private static analyzeStyle(): string[] {
    const styles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant', 'tropical', 'summer'];
    return this.getRandomItems(styles, 1, 2);
  }

  private static detectPatterns(): string[] {
    const patterns = ['solid', 'striped', 'floral', 'geometric', 'polka dot', 'plaid', 'abstract', 'tropical', 'hawaiian'];
    return this.getRandomItems(patterns, 0, 2);
  }

  private static detectMaterials(): string[] {
    const materials = ['cotton', 'denim', 'leather', 'silk', 'wool', 'polyester', 'linen', 'cashmere', 'canvas'];
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

  private static async generateDiverseResults(queryTerms: string[]): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 4) + 6; // 6-9 results
    const results: SearchResult[] = [];

    // Force diverse items including the requested ones
    const mustHaveItems = ['hawaiian shirt', 'hat', 'skirt', 'handbag', 'shoes'];
    const diverseItems = [...mustHaveItems];
    
    // Add more random items to fill the rest
    while (diverseItems.length < resultCount) {
      const randomItem = this.FASHION_ITEMS[Math.floor(Math.random() * this.FASHION_ITEMS.length)];
      if (!diverseItems.includes(randomItem)) {
        diverseItems.push(randomItem);
      }
    }

    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleResult(queryTerms, i, diverseItems[i]);
      results.push(result);
    }

    // Sort by similarity (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static async generateSingleResult(queryTerms: string[], index: number, itemType: string): Promise<SearchResult> {
    const colors = this.getRelevantColors(queryTerms);
    const styles = this.getRelevantStyles(queryTerms);
    
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

  private static getRelevantColors(queryTerms: string[]): string[] {
    const allColors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral'];
    const relevant = allColors.filter(color => queryTerms.includes(color));
    return relevant.length > 0 ? relevant : ['black', 'white', 'blue', 'red'];
  }

  private static getRelevantStyles(queryTerms: string[]): string[] {
    const allStyles = ['casual', 'formal', 'vintage', 'modern', 'bohemian', 'minimalist', 'streetwear', 'classic', 'sporty', 'elegant', 'tropical'];
    const relevant = allStyles.filter(style => queryTerms.includes(style));
    return relevant.length > 0 ? relevant : ['casual', 'modern', 'classic'];
  }

  private static generateProductTitle(itemType: string, color: string, style: string): string {
    const adjectives = ['Premium', 'Classic', 'Modern', 'Vintage', 'Designer', 'Comfortable', 'Stylish', 'Trendy', 'Chic', 'Elegant'];
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
      'hawaiian shirt': [35, 90],
      'skirt': [20, 90],
      'jeans': [40, 120],
      't-shirt': [15, 60],
      'sweater': [35, 100],
      'hat': [20, 80],
      'cap': [15, 50],
      'fedora': [40, 120],
      'default': [20, 100]
    };

    const [min, max] = basePrices[itemType] || basePrices.default;
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${price}.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }

  private static calculateSimilarity(queryTerms: string[], title: string): number {
    const titleLower = title.toLowerCase();
    const matches = queryTerms.filter(term => titleLower.includes(term)).length;
    const similarity = Math.min(95, 65 + (matches * 8) + Math.floor(Math.random() * 12));
    return similarity;
  }

  private static async getProductImage(itemType: string, index: number): Promise<string> {
    const keyword = this.UNSPLASH_KEYWORDS[itemType] || 'fashion-clothing';
    const imageId = Math.floor(Math.random() * 1000) + 1000;
    
    // Use different image sources for better variety
    const sources = [
      `https://images.unsplash.com/photo-${1500000000000 + imageId}?w=400&h=400&fit=crop&q=80`,
      `https://images.unsplash.com/photo-${1600000000000 + imageId}?w=400&h=400&fit=crop&q=80`,
      `https://images.unsplash.com/photo-${1700000000000 + imageId}?w=400&h=400&fit=crop&q=80`
    ];
    
    return sources[index % sources.length];
  }

  private static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
