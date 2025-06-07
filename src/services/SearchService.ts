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
   
    'jacket': [
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1555583743-991174c11425?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGphY2tldHxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1727515192207-3dc860bfd773?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE2fHxqYWNrZXR8ZW58MHx8MHx8fDA%3D'
    ],
    
  };

  // Item type mapping for better detection
  private static readonly ITEM_TYPE_MAPPING = {
    
    'jacket': 'jacket',
    
    
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
