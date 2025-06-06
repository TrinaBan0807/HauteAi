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
  primaryItemType?: string;
}

export class SearchService {
  private static readonly DEMO_STORES = [
    'Fashion Store', 'Style Hub', 'Eco Fashion', 'Dress Boutique', 
    'Fashion Forward', 'Shoe Palace', 'Athletic Gear', 'Luxury Brands', 
    'Everyday Wear', 'Trendy Closet', 'Vintage Finds', 'Modern Wear'
  ];

  private static readonly ITEM_IMAGE_MAPPING = {
    'hawaiian shirt': [
      'https://media.istockphoto.com/id/1172495989/photo/image-of-indian-man-looking-handsome-smiling-looking-at-camera-standing-along-side-coconut.jpg?s=1024x1024&w=is&k=20&c=RmWP4v1KzbkffVahnIi0hJAoUVk6pKCodVcWF_4f55M=',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&q=80'
    ],
    't-shirt': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://unsplash.com/photos/man-in-black-crew-neck-t-shirt-standing-during-daytime-NMYG69BG_Jg',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop&q=80'
    ],
    'shirt': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80'
    ],
    'sweater': [
      'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2010&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1539657829035-a39bc9097802?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHN3ZWF0ZXJ8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1610973310510-82f514ea1986?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHN3ZWF0ZXJ8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1511521813058-63a19d5d3559?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    'jeans': [
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGplYW5zfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGplYW5zfGVufDB8fDB8fHww'
    ],
    'pants': [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFudHN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1694447814836-c93ab70f7398?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBhbnRzfGVufDB8fDB8fHww'
    ],
    'dress': [
      'https://images.unsplash.com/photo-1519307060515-209ebd006397?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwyMzQ2OTQ5fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1530542435746-c0a7237af532?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8M3wyMzQ2OTQ5fHxlbnwwfHx8fHw%3D',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTl8MjM0Njk0OXx8ZW58MHx8fHx8'
    ],
    'bag': [
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJhZ3N8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1630830607408-261889eb4968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGJhZ3N8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80'
    ],
    'handbag': [
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJhZ3N8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1630830607408-261889eb4968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGJhZ3N8ZW58MHx8MHx8fDA%3D',
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

  // Enhanced item type detection with better priority and accuracy
  private static readonly ITEM_TYPE_PRIORITY = [
    // Accessories (highest priority as they're most distinct)
    'hat', 'cap', 'bag', 'handbag', 'belt', 'scarf', 'shoes', 'sneakers',
    // Clothing items
    'dress', 'jacket', 'hawaiian shirt', 't-shirt', 'shirt', 'sweater', 'skirt', 'jeans', 'pants'
  ];

  private static readonly ITEM_TYPE_MAPPING = {
    // Bags - all bag-related terms map to 'bag'
    'bag': 'bag',
    'handbag': 'bag', 
    'purse': 'bag',
    'clutch': 'bag',
    'backpack': 'bag',
    'tote': 'bag',
    'satchel': 'bag',
    
    // Hats - all hat-related terms map to 'hat'
    'hat': 'hat',
    'cap': 'hat',
    'beanie': 'hat',
    'fedora': 'hat',
    'baseball cap': 'hat',
    
    // Shirts - all shirt-related terms map to 'shirt'
    'shirt': 'shirt',
    'hawaiian shirt': 'shirt',
    'aloha shirt': 'shirt',
    't-shirt': 'shirt',
    'tee': 'shirt',
    'blouse': 'shirt',
    'top': 'shirt',
    
    // Other items maintain their specific types
    'sweater': 'sweater',
    'pullover': 'sweater',
    'cardigan': 'sweater',
    'jeans': 'jeans',
    'denim': 'jeans',
    'pants': 'pants',
    'trousers': 'pants',
    'dress': 'dress',
    'gown': 'dress',
    'shoes': 'shoes',
    'sneakers': 'sneakers',
    'boots': 'shoes',
    'skirt': 'skirt',
    'jacket': 'jacket',
    'blazer': 'jacket',
    'coat': 'jacket',
    'scarf': 'scarf',
    'belt': 'belt'
  };

  static async analyzeImage(imageData: string, selectedArea?: any): Promise<ImageAnalysis> {
    console.log('Analyzing image for fashion items with enhanced detection...');
    
    // Simulate image processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced item detection based on selected area analysis
    const primaryItemType = this.detectPrimaryItemFromArea(selectedArea);
    const detectedItems = this.generateDetectedItems(primaryItemType);
    
    const analysis: ImageAnalysis = {
      dominantColors: this.extractDominantColors(),
      detectedItems,
      style: this.analyzeStyle(),
      patterns: this.detectPatterns(),
      material: this.detectMaterials(),
      primaryItemType
    };
    
    console.log('Enhanced image analysis complete:', analysis);
    return analysis;
  }

  // Enhanced detection based on area position and size
  private static detectPrimaryItemFromArea(selectedArea?: any): string {
    if (!selectedArea) {
      return this.getRandomItemType();
    }

    // Simulate intelligent analysis based on area characteristics
    const { x, y, width, height } = selectedArea;
    const aspectRatio = width / height;
    
    // Head area detection (top portion, small square-ish area)
    if (y < 200 && aspectRatio > 0.8 && aspectRatio < 1.5) {
      return 'hat';
    }
    
    // Hand/side area detection (side areas, rectangular)
    if ((x < 150 || x > 300) && aspectRatio > 0.5 && aspectRatio < 2) {
      return 'bag';
    }
    
    // Torso area (middle area, varies in size)
    if (y > 150 && y < 350 && x > 100 && x < 350) {
      // Determine clothing type based on area size and position
      if (height > 100) {
        return Math.random() > 0.5 ? 'dress' : 'shirt';
      } else {
        return 'shirt';
      }
    }
    
    // Lower body area
    if (y > 300) {
      return Math.random() > 0.5 ? 'pants' : 'skirt';
    }
    
    // Foot area (bottom area)
    if (y > 450) {
      return 'shoes';
    }
    
    return this.getRandomItemType();
  }

  private static getRandomItemType(): string {
    const types = ['bag', 'hat', 'shirt', 'pants', 'shoes', 'dress'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateDetectedItems(primaryType: string): string[] {
    // Always include the primary type first
    const items = [primaryType];
    
    // Add some related items for context but maintain primary focus
    const relatedItems = this.getRelatedItems(primaryType);
    items.push(...relatedItems.slice(0, 2));
    
    return items;
  }

  private static getRelatedItems(primaryType: string): string[] {
    const related = {
      'bag': ['handbag', 'purse'],
      'hat': ['cap', 'beanie'],
      'shirt': ['t-shirt', 'blouse'],
      'pants': ['jeans', 'trousers'],
      'shoes': ['sneakers', 'boots'],
      'dress': ['gown', 'skirt'],
      'sweater': ['cardigan', 'pullover'],
      'jacket': ['blazer', 'coat'],
      'scarf': ['wrap', 'shawl'],
      'belt': ['accessory']
    };
    
    return related[primaryType] || [];
  }

  static async searchByQuery(query: string, filterByItemType?: string): Promise<SearchResult[]> {
    console.log('Searching with strict item filter:', { query, filterByItemType });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!filterByItemType) {
      console.log('No filter specified, returning general results');
      return this.generateGeneralResults(query);
    }

    // Generate results ONLY for the specified item type
    const results = await this.generateStrictlyFilteredResults(filterByItemType, query);
    
    console.log(`Generated ${results.length} results strictly for: ${filterByItemType}`);
    return results;
  }

  private static async generateStrictlyFilteredResults(itemType: string, query: string): Promise<SearchResult[]> {
    const resultCount = Math.floor(Math.random() * 4) + 6; // 6-9 results
    const results: SearchResult[] = [];
    
    console.log(`Generating ${resultCount} results exclusively for item type: ${itemType}`);
    
    // Use the mapped item type for image selection
    const imageKey = this.getImageKeyForItemType(itemType);
    
    for (let i = 0; i < resultCount; i++) {
      const result = await this.generateSingleStrictResult(itemType, imageKey, query, i);
      results.push(result);
    }

    // Sort by similarity (highest first)
    return results.sort((a, b) => b.similarity - a.similarity);
  }

  private static getImageKeyForItemType(itemType: string): string {
    // Map our normalized types back to image keys
    const mapping = {
      'bag': 'bag',
      'hat': 'hat', 
      'shirt': 'shirt',
      'pants': 'jeans', // Use jeans images for pants
      'shoes': 'shoes',
      'dress': 'dress',
      'sweater': 'sweater',
      'jacket': 'jacket',
      'scarf': 'scarf',
      'belt': 'belt',
      'jeans': 'jeans',
      'sneakers': 'sneakers',
      'skirt': 'skirt'
    };
    
    return mapping[itemType] || itemType;
  }

  private static async generateSingleStrictResult(itemType: string, imageKey: string, query: string, index: number): Promise<SearchResult> {
    const queryTerms = this.extractQueryTerms(query);
    const colors = this.getRelevantColors(queryTerms);
    const styles = this.getRelevantStyles(queryTerms);
    
    const color = colors[Math.floor(Math.random() * colors.length)] || 'classic';
    const style = styles[Math.floor(Math.random() * styles.length)] || 'modern';
    
    // Generate title that always includes the item type
    const title = this.generateStrictProductTitle(itemType, color, style);
    const price = this.generatePrice(itemType);
    const store = this.DEMO_STORES[Math.floor(Math.random() * this.DEMO_STORES.length)];
    const similarity = this.calculateSimilarity(queryTerms, title, itemType);
    const imageUrl = this.getStrictItemImage(imageKey, index);

    return {
      id: `strict_${itemType}_${Date.now()}_${index}`,
      title,
      price,
      store,
      imageUrl,
      link: `#${itemType}_product_${index}`,
      similarity
    };
  }

  private static generateStrictProductTitle(itemType: string, color: string, style: string): string {
    const adjectives = ['Premium', 'Classic', 'Modern', 'Vintage', 'Designer', 'Comfortable', 'Stylish', 'Trendy', 'Chic', 'Elegant'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    // Ensure the item type is always prominently featured in the title
    const itemTypeVariations = {
      'bag': ['Bag', 'Handbag', 'Tote Bag', 'Shoulder Bag'],
      'hat': ['Hat', 'Cap', 'Beanie', 'Fedora'],
      'shirt': ['Shirt', 'Blouse', 'Top', 'T-Shirt'],
      'pants': ['Pants', 'Trousers', 'Slacks'],
      'shoes': ['Shoes', 'Footwear', 'Sneakers'],
      'dress': ['Dress', 'Gown', 'Frock'],
      'sweater': ['Sweater', 'Pullover', 'Knit'],
      'jacket': ['Jacket', 'Blazer', 'Coat'],
      'scarf': ['Scarf', 'Wrap', 'Shawl'],
      'belt': ['Belt', 'Waist Belt'],
      'jeans': ['Jeans', 'Denim'],
      'skirt': ['Skirt', 'Mini Skirt']
    };
    
    const variations = itemTypeVariations[itemType] || [itemType];
    const itemVariation = variations[Math.floor(Math.random() * variations.length)];
    
    const parts = [adjective, color, style, itemVariation].filter(Boolean);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  private static getStrictItemImage(imageKey: string, index: number): string {
    const images = this.ITEM_IMAGE_MAPPING[imageKey as keyof typeof this.ITEM_IMAGE_MAPPING];
    if (images && images.length > 0) {
      return images[index % images.length];
    }
    
    // Fallback to a generic fashion image
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80';
  }

  private static calculateSimilarity(queryTerms: string[], title: string, itemType: string): number {
    const titleLower = title.toLowerCase();
    let baseScore = 70;
    
    // High bonus for exact item type match
    if (titleLower.includes(itemType.toLowerCase())) {
      baseScore += 20;
    }
    
    // Bonus for query term matches
    const matches = queryTerms.filter(term => titleLower.includes(term)).length;
    baseScore += matches * 3;
    
    // Add some randomness but keep it high
    const similarity = Math.min(95, baseScore + Math.floor(Math.random() * 8));
    return similarity;
  }

  // ... keep existing code (generateGeneralResults, extractDominantColors, analyzeStyle, detectPatterns, detectMaterials, extractQueryTerms, getRelevantColors, getRelevantStyles, generatePrice, getRandomItems methods)

  static async searchByImageAndDescription(
    imageData: string, 
    selectedArea: any, 
    description: string
  ): Promise<SearchResult[]> {
    console.log('Starting enhanced image + description search...');
    
    // Analyze the image with enhanced detection
    const imageAnalysis = await this.analyzeImage(imageData, selectedArea);
    
    // Combine image analysis with description
    const combinedQuery = this.combineImageAndText(imageAnalysis, description);
    
    // Search with strict filtering by the detected primary item type
    return await this.searchByQuery(combinedQuery, imageAnalysis.primaryItemType);
  }

  private static generateGeneralResults(query: string): SearchResult[] {
    // Fallback for when no specific item type is detected
    return [];
  }

  private static extractDominantColors(): string[] {
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'navy', 'beige', 'orange', 'coral', 'turquoise'];
    return this.getRandomItems(colors, 2, 4);
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

  private static generatePrice(itemType: string): string {
    const basePrices: { [key: string]: [number, number] } = {
      'bag': [60, 350],
      'handbag': [80, 350],
      'hat': [20, 80],
      'cap': [15, 50],
      'shoes': [50, 200],
      'sneakers': [60, 180],
      'dress': [30, 150],
      'jacket': [60, 300],
      'shirt': [25, 80],
      'hawaiian shirt': [35, 90],
      'skirt': [20, 90],
      'jeans': [40, 120],
      'pants': [35, 110],
      't-shirt': [15, 60],
      'sweater': [35, 100],
      'scarf': [25, 85],
      'belt': [20, 70],
      'default': [20, 100]
    };

    const [min, max] = basePrices[itemType] || basePrices.default;
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    return `$${price}.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }

  private static getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
