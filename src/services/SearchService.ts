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
  primaryItemType?: string; // Add primary item type detection
}

export class SearchService {
  private static readonly DEMO_STORES = [
    'Fashion Store', 'Style Hub', 'Eco Fashion', 'Dress Boutique', 
    'Fashion Forward', 'Shoe Palace', 'Athletic Gear', 'Luxury Brands', 
    'Everyday Wear', 'Trendy Closet', 'Vintage Finds', 'Modern Wear'
  ];

  private static readonly ITEM_IMAGE_MAPPING = {
    'hawaiian shirt': [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&q=80'
    ],
    't-shirt': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop&q=80'
    ],
    'shirt': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80'
    ],
    'sweater': [
      'https://images.unsplash.com/photo-1564257577-bbf9c2912d34?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140188-3b2a7e95e8c4?w=400&h=400&fit=crop&q=80'
    ],
    'jeans': [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&q=80'
    ],
    'pants': [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&q=80'
    ],
    'dress': [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&h=400&fit=crop&q=80'
    ],
    'handbag': [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80'
    ],
    'bag': [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80'
    ],
    'shoes': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80'
    ],
    'sneakers': [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80'
    ],
    'hat': [
      'https://images.unsplash.com/photo-1485968612651-46e6e622dde?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80'
    ],
    'cap': [
      'https://images.unsplash.com/photo-1485968612651-46e6e622dde?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80'
    ],
    'skirt': [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582142306909-195724d2b26d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108755-2616c2e19687?w=400&h=400&fit=crop&q=80'
    ],
    'jacket': [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80'
    ],
    'scarf': [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80'
    ],
    'belt': [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80'
    ]
  };

  // Item type mapping for better detection
  private static readonly ITEM_TYPE_MAPPING = {
    'sweater': 'sweater',
    'pullover': 'sweater',
    'jumper': 'sweater',
    'cardigan': 'sweater',
    'jeans': 'jeans',
    'denim': 'jeans',
    'pants': 'pants',
    'trousers': 'pants',
    'scarf': 'scarf',
    'wrap': 'scarf',
    'shawl': 'scarf',
    'hawaiian shirt': 'hawaiian shirt',
    'aloha shirt': 'hawaiian shirt',
    'tropical shirt': 'hawaiian shirt',
    't-shirt': 't-shirt',
    'tee': 't-shirt',
    'tshirt': 't-shirt',
    'shirt': 'shirt',
    'blouse': 'shirt',
    'top': 'shirt',
    'dress': 'dress',
    'frock': 'dress',
    'gown': 'dress',
    'handbag': 'handbag',
    'bag': 'bag',
    'purse': 'handbag',
    'clutch': 'handbag',
    'shoes': 'shoes',
    'footwear': 'shoes',
    'sneakers': 'sneakers',
    'trainers': 'sneakers',
    'kicks': 'sneakers',
    'hat': 'hat',
    'cap': 'cap',
    'beanie': 'hat',
    'skirt': 'skirt',
    'miniskirt': 'skirt',
    'jacket': 'jacket',
    'blazer': 'jacket',
    'coat': 'jacket',
    'belt': 'belt'
    
  };

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    console.log('Analyzing image for fashion items...');
    
    // Simulate image processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Detect primary item type based on selected area analysis
    const detectedItems = this.detectDiverseFashionItems();
    const primaryItemType = this.detectPrimaryItemType(detectedItems, selectedArea);
    
    // Simulate AI image analysis with diverse items
    const analysis: ImageAnalysis = {
      dominantColors: this.extractDominantColors(),
      detectedItems,
      style: this.analyzeStyle(),
      patterns: this.detectPatterns(),
      material: this.detectMaterials(),
      primaryItemType
    };
    
    console.log('Image analysis complete:', analysis);
    return analysis;
  }

  static async searchByQuery(query: string, filterByItemType?: string): Promise<SearchResult[]> {
    console.log('Searching for items with query:', query, 'Filter:', filterByItemType);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryTerms = this.extractQueryTerms(query);
    const results = await this.generateDiverseResults(queryTerms, filterByItemType);
    
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
    
    // Search based on combined analysis, filtered by primary item type
    return await this.searchByQuery(combinedQuery, imageAnalysis.primaryItemType);
  }

  private static detectPrimaryItemType(detectedItems: string[], selectedArea?: any): string | undefined {
    // Simulate advanced image analysis to detect the primary item type
    // In a real implementation, this would analyze the selected area specifically
    
    const itemTypePriority = {
      'hat': ['hat', 'cap', 'beanie'],
      'bag': ['handbag', 'bag', 'purse', 'clutch'],
      'shoes': ['shoes', 'sneakers', 'boots'],
      'shirt': ['hawaiian shirt', 't-shirt', 'shirt', 'blouse'],
      'dress': ['dress', 'gown'],
      'pants': ['jeans', 'pants', 'trousers'],
      'jacket': ['jacket', 'blazer', 'coat']
    };

    // Check for high-priority items first (accessories like hats and bags)
    for (const [category, items] of Object.entries(itemTypePriority)) {
      for (const item of detectedItems) {
        if (items.includes(item)) {
          console.log(`Primary item type detected: ${category} (from ${item})`);
          return category;
        }
      }
    }

    // If no specific match, return the first detected item
    return detectedItems[0] ? this.ITEM_TYPE_MAPPING[detectedItems[0]] : undefined;
  }

  private static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral', 'turquoise'];
    return this.getRandomItems(colors, 2, 4);
  }

  private static detectDiverseFashionItems(): string[] {
    // Ensure we get diverse items by selecting from different categories
    const categories = {
      tops: ['hawaiian shirt', 't-shirt', 'shirt', 'sweater'],
      bottoms: ['skirt', 'jeans', 'pants'],
      accessories: ['handbag', 'bag', 'hat', 'cap', 'scarf', 'belt'],
      footwear: ['shoes', 'sneakers', 'boots'],
      outerwear: ['jacket', 'coat', 'blazer']
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

  private static async generateDiverseResults(queryTerms: string[], filterByItemType?: string): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 4) + 6; // 6-9 results
    const results: SearchResult[] = [];

    let relevantItemTypes: string[];
    
    if (filterByItemType) {
      // If we have a specific item type to filter by, use only that type
      relevantItemTypes = [filterByItemType];
      console.log(`Filtering results to show only: ${filterByItemType}`);
    } else {
      // Extract all relevant item types from query terms using improved mapping
      relevantItemTypes = this.extractRelevantItemTypes(queryTerms);
    }
    
    // Generate results focused on the detected item types
    for (let i = 0; i < resultCount; i++) {
      const itemType = relevantItemTypes[i % relevantItemTypes.length] || 'shirt';
      const result = await this.generateSingleResult(queryTerms, i, itemType);
      results.push(result);
    }

    // Sort by similarity (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static extractRelevantItemTypes(queryTerms: string[]): string[] {
    const foundTypes = [];
    
    // Look through all query terms to find matching item types
    for (const term of queryTerms) {
      // Check exact matches in mapping
      if (this.ITEM_TYPE_MAPPING[term]) {
        const mappedType = this.ITEM_TYPE_MAPPING[term];
        if (!foundTypes.includes(mappedType)) {
          foundTypes.push(mappedType);
        }
      }
      
      // Check partial matches
      for (const [key, value] of Object.entries(this.ITEM_TYPE_MAPPING)) {
        if (term.includes(key) || key.includes(term)) {
          if (!foundTypes.includes(value)) {
            foundTypes.push(value);
          }
        }
      }
    }
    
    // Return found types or default fallbacks
    return foundTypes.length > 0 ? foundTypes : ['shirt', 't-shirt', 'dress'];
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
    // Map pants to jeans for image consistency
    const imageKey = itemType === 'pants' ? 'jeans' : itemType;
    const images = this.ITEM_IMAGE_MAPPING[imageKey as keyof typeof this.ITEM_IMAGE_MAPPING];
    if (images && images.length > 0) {
      return images[index % images.length];
    }
    
    // Fallback to generic fashion image
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80';
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
      'bag': [60, 250],
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
      'pants': [35, 110],
      't-shirt': [15, 60],
      'sweater': [35, 100],
      'hat': [20, 80],
      'cap': [15, 50],
      'fedora': [40, 120],
      'scarf': [25, 85],
      'belt': [20, 70],
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

  private static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
