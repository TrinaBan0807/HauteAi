
export interface SearchResult {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  link: string;
  similarity: number;
}

export interface ImageAnalysis {
  dominantColors: string[];
  detectedItems: string[];
  style: string[];
  patterns: string[];
  material: string[];
}
