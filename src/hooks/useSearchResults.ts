
import { useState, useEffect } from 'react';
import { SearchService } from '@/services/SearchService';

interface SearchResult {
  id: string;
  title: string;
  price: string;
  store: string;
  imageUrl: string;
  link: string;
  similarity: number;
}

export const useSearchResults = (selectedImage: string | null, selectedArea: any, description: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const performDynamicSearch = async (imageData: string | null, area: any, desc: string) => {
    console.log('Starting dynamic search...');
    console.log('Image data:', imageData ? 'Image provided' : 'No image');
    console.log('Selected area:', area);
    console.log('Description:', desc);

    setIsLoading(true);
    setError(null);
    setSearchQuery('Processing...');
    
    try {
      let searchResults: SearchResult[] = [];

      if (imageData && desc) {
        // Combined image and text search
        setSearchQuery('Analyzing image and description...');
        searchResults = await SearchService.searchByImageAndDescription(imageData, area, desc);
        setSearchQuery(`Image + Text: "${desc}"`);
      } else if (imageData) {
        // Image-only search
        setSearchQuery('Analyzing image...');
        const imageAnalysis = await SearchService.analyzeImage(imageData, area);
        const analysisQuery = [...imageAnalysis.detectedItems, ...imageAnalysis.dominantColors].join(' ');
        searchResults = await SearchService.searchByQuery(analysisQuery);
        setSearchQuery(`Image Analysis: ${analysisQuery}`);
      } else if (desc) {
        // Text-only search
        setSearchQuery(`Text Search: "${desc}"`);
        searchResults = await SearchService.searchByQuery(desc);
      }

      setResults(searchResults);
      
    } catch (error) {
      console.error('Dynamic search failed:', error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const retrySearch = () => {
    if (selectedImage || description) {
      performDynamicSearch(selectedImage, selectedArea, description);
    }
  };

  useEffect(() => {
    if (selectedImage || description) {
      performDynamicSearch(selectedImage, selectedArea, description);
    }
  }, [selectedImage, selectedArea, description]);

  return {
    results,
    isLoading,
    searchQuery,
    error,
    retrySearch
  };
};
